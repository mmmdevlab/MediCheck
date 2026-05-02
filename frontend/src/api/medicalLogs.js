import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const logFeeling = async (feelingScore) => {
  const response = await axios.post(
    `${API_URL}/logs`,
    { feelingScore },
    { headers: getAuthHeader() }
  );
  return response.data;
};

const getMyLogs = async (days = 7) => {
  const response = await axios.get(`${API_URL}/logs`, {
    params: { days },
    headers: getAuthHeader(),
  });
  return response.data;
};

const getPatientLatestLog = async (patientId) => {
  const response = await axios.get(
    `${API_URL}/logs/patients/${patientId}/latest`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

const getPatientLogs = async (patientId, days = 7) => {
  const response = await axios.get(`${API_URL}/logs/patients/${patientId}`, {
    params: { days },
    headers: getAuthHeader(),
  });
  return response.data;
};

export default { logFeeling, getMyLogs, getPatientLatestLog, getPatientLogs };
