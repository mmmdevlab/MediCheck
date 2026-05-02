import apiClient from './client';

const appointmentsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/appointments');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  update: async (id, appointmentData) => {
    const response = await apiClient.put(
      `/appointments/${id}`,
      appointmentData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },

  complete: async (id) => {
    const response = await apiClient.patch(`/appointments/${id}/complete`);
    return response.data;
  },
};

export default appointmentsAPI;
