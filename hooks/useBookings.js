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
    } catch {
      setError('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.post(ENDPOINTS.CANCEL_BOOKING(id));
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      Toast.show({ type: 'success', text1: 'Booking cancelled.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not cancel booking.' });
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
};