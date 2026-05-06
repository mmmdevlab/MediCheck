import apiClient from '../api/clientFetch';

export const logFeeling = async (data) => {
  const feelingScore = Number(data?.feelingScore);

  if (!Number.isInteger(feelingScore) || feelingScore < 1 || feelingScore > 5) {
    throw new Error(`Invalid feelingScore sent to API: ${data?.feelingScore}`);
  }

  const response = await apiClient.post('/logs', {
    feelingScore,
  });

  return response.data;
};

export const getMyLogs = async (days = 7) => {
  const response = await apiClient.get('/logs', { params: { days } });
  return response.data;
};

export const getPatientLatestLog = async (patientId) => {
  const response = await apiClient.get(`/logs/patients/${patientId}/latest`);
  return response.data;
};

export const getPatientLogs = async (patientId, days = 7) => {
  const response = await apiClient.get(`/logs/patients/${patientId}`, {
    params: { days },
  });
  return response.data;
};
