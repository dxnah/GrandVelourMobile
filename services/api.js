import axios from 'axios';
import { BASE_URL } from '../constants/Api';
import { getToken, saveToken, removeToken } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/api/v1/auth/token/refresh/`, {
          refresh,
        });
        const newAccess = res.data.access;
        await saveToken(newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        await removeToken();
        // Optionally trigger logout here
      }
    }
    return Promise.reject(error);
  }
);

export default api;