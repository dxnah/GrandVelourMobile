import api from './api';

export const uploadProfilePhoto = async (imageAsset) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri:  imageAsset.uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  });
  const res = await api.patch('/api/v1/user/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};