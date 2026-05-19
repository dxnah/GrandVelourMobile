import api from './api';
import { ENDPOINTS } from '../constants/Api';

export const getRooms = async () => {
  const res = await api.get(ENDPOINTS.ROOMS);
  return res.data;
};

export const getRoom = async (id) => {
  const res = await api.get(`${ENDPOINTS.ROOMS}${id}/`);
  return res.data;
};