import axios, { type CreateAxiosDefaults } from 'axios';

// Use environment variable if available, otherwise use default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

console.log('API Base URL:', BASE_URL);

const IS_LOGIN = 'monito-store-isLogin';

// Create a function to properly handle parameter serialization
const paramsSerializer = (params: any) => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];
    if (value === undefined || value === null) continue;

    // Handle booleans explicitly
    if (typeof value === 'boolean') {
      searchParams.append(key, value ? 'true' : 'false');
    }
    // Handle numbers explicitly
    else if (typeof value === 'number') {
      searchParams.append(key, value.toString());
    }
    // Handle all other types
    else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
};

const options: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: paramsSerializer,
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
