import apiClient from './client';

export const getAllAppointments = async () => {
  const response = await apiClient.get('/appointments');
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await apiClient.get(`/appointments/${id}`);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await apiClient.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await apiClient.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await apiClient.delete(`/appointments/${id}`);
  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await apiClient.patch(`/appointments/${id}/complete`);
  return response.data;
};

export const undoCompleteAppointment = async (id) => {
  const response = await apiClient.patch(`/appointments/${id}/undo`);
  return response.data;
};
