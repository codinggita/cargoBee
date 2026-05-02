import axios from 'axios';
import { getLocalItem } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getLocalItem('cargobee_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (clear token, redirect to login)
      // This might be better handled in a component or hook to dispatch actions
      console.warn('Unauthorized request handled by interceptor');
    }
    return Promise.reject(error);
  }
);

export default api;
