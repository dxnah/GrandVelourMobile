import React, { createContext, useState, useEffect } from 'react';
import { getUserData, getToken, removeToken } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app start, restore session if token exists
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

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.is_staff === true;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};