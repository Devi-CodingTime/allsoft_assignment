import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apis.allsoft.co/api/documentManagement';

export const apiClient = axios.create({ baseURL: BASE_URL, timeout: 30000 });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('docsphere_token');
  if (token) config.headers.token = token;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.response?.data?.error || error?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;