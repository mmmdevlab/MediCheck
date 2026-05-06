import apiClient from '../api/clientFetch';

export const createSupportRequest = async (requestData) => {
  const response = await apiClient.post('/support', requestData);
  return response.data.data ?? response.data;
};

export const getMySupportRequests = async () => {
  const response = await apiClient.get('/support');
  return response.data.data ?? response.data;
};

export const getSupportRequestById = async (requestId) => {
  const response = await apiClient.get(`/support/${requestId}`);
  return response.data.data ?? response.data;
};

export const updateSupportRequest = async (requestId, message) => {
  const response = await apiClient.put(`/support/${requestId}`, { message });
  return response.data.data ?? response.data;
};

export const deleteSupportRequest = async (requestId) => {
  const response = await apiClient.delete(`/support/${requestId}`);
  return response.data.data ?? response.data;
};

export const getAssignedSupportRequests = async (status) => {
  const params = status ? { status } : {};
  const response = await apiClient.get('/support/assigned', { params });
  return response.data.data ?? response.data;
};

export const respondToSupportRequest = async (requestId, status) => {
  const response = await apiClient.patch(`/support/${requestId}/respond`, {
    status,
  });
  return response.data.data ?? response.data;
};

export const completeSupportRequest = async (requestId) => {
  const response = await apiClient.patch(`/support/${requestId}/complete`);
  return response.data.data ?? response.data;
};
