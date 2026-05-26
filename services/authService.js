import api from './api';
import { ENDPOINTS } from '../constants/Api';
import { saveToken, saveUserData, removeToken } from '../utils/storage';
import { supabase } from '../supabase';

export const loginUser = async (email, password) => {
  // 1. Sign into Supabase (handles auth session)
  const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({ email, password });
  if (sbError) throw new Error(sbError.message);

  // 2. Sign into Django (handles business logic + your existing API)
  const res = await api.post(ENDPOINTS.LOGIN, { email, password });
  if (res.data.access) {
    await saveToken(res.data.access);
    await saveUserData(res.data.user);
  }
  return res.data;
};

export const registerUser = async (userData) => {
  // 1. Register in Supabase first
  const { error: sbError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });
  if (sbError) throw new Error(sbError.message);

  // 2. Register in Django
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
  await supabase.auth.signOut();   // clear Supabase session
  await removeToken();             // clear Django token
};