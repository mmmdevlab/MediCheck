import apiClient from './client';

const logFeeling = async (feelingScore) => {
  const response = await apiClient.post('/logs', {
    feelingScore,
  });
  return response.data;
};

const getMyLogs = async (days = 7) => {
  const response = await apiClient.get('/logs', {
    params: { days },
  });
  return response.data;
};

const getPatientLatestLog = async (patientId) => {
  const response = await apiClient.get(`/logs/patients/${patientId}/latest`);
  return response.data;
};

const getPatientLogs = async (patientId, days = 7) => {
  const response = await apiClient.get(`/logs/patients/${patientId}`, {
    params: { days },
  });
  return response.data;
};

export default { logFeeling, getMyLogs, getPatientLatestLog, getPatientLogs };
