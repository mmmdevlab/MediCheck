const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
const TIMEOUT = 10000;

const isAuthEndpoint = (url = '') =>
  ['/auth/login', '/auth/signup'].some((endpoint) => url.includes(endpoint));

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

const buildUrl = (url, params) => {
  let full = url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
  if (params && typeof params === 'object') {
    const esc = encodeURIComponent;
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        if (Array.isArray(v))
          return v.map((x) => `${esc(k)}=${esc(x)}`).join('&');
        return `${esc(k)}=${esc(v)}`;
      })
      .join('&');
    if (query) full += `?${query}`;
  }
  return full;
};

const defaultHeaders = (extra) => ({
  'Content-Type': 'application/json',
  ...(extra || {}),
});

const performRefresh = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token');
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => null);
      const error = new Error('Refresh failed');
      error.response = { data: errBody, status: res.status };
      throw error;
    }

    const data = await res.json().catch(() => null);
    const newAccessToken = data?.accessToken;
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
    }
    return newAccessToken;
  } catch (err) {
    throw err;
  }
};

const request = async (method, url, options = {}) => {
  const {
    data = null,
    params = null,
    headers = {},
    signal: externalSignal,
  } = options;
  const fullUrl = buildUrl(url, params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  const signal = externalSignal || controller.signal;

  const token = localStorage.getItem('accessToken');
  const reqHeaders = defaultHeaders(headers);
  if (token) reqHeaders.Authorization = `Bearer ${token}`;

  const fetchOptions = {
    method: method.toUpperCase(),
    headers: reqHeaders,
    signal,
  };
  if (data !== null) {
    // Allow callers to pass FormData or other body types
    if (data instanceof FormData) {
      delete fetchOptions.headers['Content-Type'];
      fetchOptions.body = data;
    } else {
      fetchOptions.body = JSON.stringify(data);
    }
  }

  try {
    const res = await fetch(fullUrl, fetchOptions);
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    let parsed = null;
    if (contentType.includes('application/json')) {
      parsed = await res.json().catch(() => null);
    } else {
      parsed = await res.text().catch(() => null);
    }

    if (res.ok) {
      return {
        data: parsed,
        status: res.status,
        headers: res.headers,
        config: { method, url: fullUrl, headers: reqHeaders },
      };
    }

    // Handle 401 specially to attempt refresh & retry
    if (res.status === 401 && !isAuthEndpoint(url)) {
      // queue and refresh logic
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
          const error = new Error('Unauthorized');
          error.response = { data: parsed, status: res.status };
          throw error;
        }

        try {
          const newToken = await performRefresh(refreshToken);
          processQueue(null, newToken);
          isRefreshing = false;
          // retry original request with new token
          if (newToken) {
            reqHeaders.Authorization = `Bearer ${newToken}`;
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
            const error = new Error('Refresh failed');
            error.response = { data: parsed, status: res.status };
            throw error;
          }
          // retry
          return await request(method, url, options);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          processQueue(refreshError, null);
          isRefreshing = false;
          window.location.href = '/auth/login';
          throw refreshError;
        }
      } else {
        // push to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: async (token) => {
              try {
                if (token) reqHeaders.Authorization = `Bearer ${token}`;
                const retryRes = await request(method, url, options);
                resolve(retryRes);
              } catch (e) {
                reject(e);
              }
            },
            reject,
          });
        });
      }
    }

    const error = new Error('Request failed');
    error.response = {
      data: parsed,
      status: res.status,
      headers: res.headers,
      config: { method, url: fullUrl },
    };
    throw error;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const error = new Error('Request timeout');
      error.code = 'ECONNABORTED';
      throw error;
    }
    throw err;
  }
};

const get = (url, config) => request('get', url, config);
const post = (url, data, config = {}) =>
  request('post', url, { ...config, data });
const put = (url, data, config = {}) =>
  request('put', url, { ...config, data });
const patch = (url, data, config = {}) =>
  request('patch', url, { ...config, data });
const del = (url, config) => request('delete', url, config);

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  const newToken = await performRefresh(refreshToken);
  if (!newToken) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Refresh failed');
  }
  return newToken;
};

const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  refreshAccessToken,
  request,
};

export default apiClient;
