import api from './api';
import { ENDPOINTS } from '../constants/Api';
import { saveToken, saveUserData, removeToken } from '../utils/storage';

export const loginUser = async (email, password) => {
  const res = await api.post(ENDPOINTS.LOGIN, { email, password });
  return res.data; 
};

export const registerUser = async (userData) => {
  const res = await api.post(ENDPOINTS.REGISTER, userData);
  return res.data;
};

export const activateAccount = async (uid, token) => {
  const res = await api.get(`${ENDPOINTS.ACTIVATE}/${uid}/${token}/`);
  return res.data;
};

export const resendActivation = async (email) => {
  const res = await api.post(ENDPOINTS.RESEND, { email });
  return res.data;
};

export const logoutUser = async () => {
  await removeToken();
};