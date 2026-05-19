import { useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/Api';
import Toast from 'react-native-toast-message';

export const useRooms = () => {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(ENDPOINTS.ROOMS);
      setRooms(res.data);
    } catch {
      setError('Could not load rooms.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`${ENDPOINTS.ROOMS}${id}/`);
      setRooms(prev => prev.filter(r => r.id !== id));
      Toast.show({ type: 'success', text1: 'Room deleted.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Delete failed.' });
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  return { rooms, loading, error, refetch: fetchRooms, deleteRoom };
};