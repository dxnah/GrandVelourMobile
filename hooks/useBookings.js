import { useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/Api';
import Toast from 'react-native-toast-message';

export const useBookings = (adminMode = false) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchBookings = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get(ENDPOINTS.BOOKINGS);
    setBookings(res.data);
    setError(null); // ← explicitly clear on success
  } catch (e) {
    // Only show error if it's not a 401 that got retried
    if (e.response?.status !== 401) {
      setError('Could not load bookings.');
    }
  } finally {
    setLoading(false);
  }
};

  const cancelBooking = async (id) => {
    try {
      await api.patch(ENDPOINTS.CANCEL_BOOKING(id));
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      Toast.show({ type: 'success', text1: 'Booking cancelled.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not cancel booking.' });
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const res = await api.post(ENDPOINTS.BOOKINGS, bookingData);
      setBookings(prev => [...prev, res.data]);
      Toast.show({ type: 'success', text1: 'Booking confirmed!', text2: 'Your reservation has been made.' });
      return { success: true, data: res.data };
    } catch (e) {
      const msg = e.response?.data?.non_field_errors?.[0]
        || e.response?.data?.detail
        || 'Could not complete booking.';
      Toast.show({ type: 'error', text1: 'Booking failed', text2: msg });
      return { success: false };
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking, createBooking };
};