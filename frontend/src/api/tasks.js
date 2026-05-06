import apiClient from './clientFetch';

export const getTasksByAppointment = async (appointmentId) => {
  const response = await apiClient.get('/tasks', { params: { appointmentId } });
  return response.data;
};

export const getMyTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await apiClient.post('/tasks', taskData);
  return response.data;
};

export const toggleTaskCompletion = async (taskId) => {
  const response = await apiClient.patch(`/tasks/${taskId}/toggle`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};
