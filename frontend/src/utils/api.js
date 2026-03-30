import axios from 'axios';

// Use environment variable for backend URL, fallback to relative path for local dev
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rm_token');
      localStorage.removeItem('rm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
