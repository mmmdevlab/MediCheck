import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthEndpoint = (url = '') =>
  ['/auth/login', '/auth/signup'].some((endpoint) => url.includes(endpoint));

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const requestUrl = error.config?.url || '';

    if (error.response?.status === 401 && !isAuthEndpoint(requestUrl)) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        try {
          const res = await apiClient.post('/auth/refresh', { refreshToken });
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          processQueue(null, newAccessToken);
          isRefreshing = false;
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          processQueue(refreshError, null);
          isRefreshing = false;
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            error.config.headers.Authorization = `Bearer ${token}`;
            return apiClient(error.config);
          })
          .catch((err) => Promise.reject(err));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
