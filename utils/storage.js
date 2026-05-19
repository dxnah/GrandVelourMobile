import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
  await AsyncStorage.setItem('userToken', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};

export const saveUserData = async (data) => {
  await AsyncStorage.setItem('userData', JSON.stringify(data));
};

export const getUserData = async () => {
  const data = await AsyncStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};