import axios from 'axios';
import { BASE_URL } from '../constants/Api';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Auto-attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — handle logout globally here if needed
    }
    return Promise.reject(error);
  }
);

export default api;