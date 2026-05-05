import client from './client';

export const getMyPatients = async () => {
  const response = await client.get('/patients');
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await client.get(`/patients/${patientId}/appointments`);
  return response.data;
};

export const grantCaregiverAccess = async (caregiverEmail) => {
  const response = await client.post('/caregivers', { caregiverEmail });
  return response.data;
};

export const getMyCaregivers = async () => {
  const response = await client.get('/caregivers');
  return response.data;
};

export const revokeCaregiverAccess = async (assignmentId) => {
  await client.delete(`/caregivers/${assignmentId}`);
};
