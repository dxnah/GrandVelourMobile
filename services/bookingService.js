import api from './api';
import { ENDPOINTS } from '../constants/Api';

export const getBookings = async () => {
  const res = await api.get(ENDPOINTS.BOOKINGS);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const res = await api.post(ENDPOINTS.BOOKINGS, bookingData);
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await api.post(ENDPOINTS.CANCEL_BOOKING(id));
  return res.data;
};

export const rescheduleBooking = async (id, data) => {
  const res = await api.post(ENDPOINTS.RESCHEDULE(id), data);
  return res.data;
};