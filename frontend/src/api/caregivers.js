import apiClient from '../api/clientFetch';

export const getMyPatients = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await apiClient.get(`/patients/${patientId}/appointments`);
  return response.data;
};

export const grantCaregiverAccess = async (caregiverEmail) => {
  const response = await apiClient.post('/caregivers', { caregiverEmail });
  return response.data;
};

export const getMyCaregivers = async () => {
  const response = await apiClient.get('/caregivers');
  return response.data;
};

export const revokeCaregiverAccess = async (assignmentId) => {
  await apiClient.delete(`/caregivers/${assignmentId}`);
};
