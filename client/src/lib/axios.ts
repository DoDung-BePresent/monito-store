import axios, { type CreateAxiosDefaults } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const IS_LOGIN = 'monito-store-isLogin';

const options: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const API = axios.create(options);

const APIRefresh = axios.create(options);

APIRefresh.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(IS_LOGIN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await APIRefresh.post('/auth/refresh-token');

        localStorage.setItem(IS_LOGIN, 'true');

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(IS_LOGIN);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;