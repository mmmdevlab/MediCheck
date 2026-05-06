import apiClient from './clientFetch';

export const deleteAccount = async () => {
  const res = await apiClient.delete('/auth/deleteMe');
  return res.data;
};
