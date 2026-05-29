import React, { createContext, useState, useEffect } from 'react';
import { getUserData, getToken, removeToken, saveToken, saveUserData } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const savedToken = await getToken();
      const savedUser  = await getUserData();
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (userData, accessToken, refreshToken) => {
    await saveToken(accessToken);
    await saveUserData(userData);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    await removeToken();
    await AsyncStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    saveUserData(merged);
  };

  const isAdmin = user?.is_staff === true;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};