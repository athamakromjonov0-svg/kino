import axios from 'axios';

// API base URL configuration from environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5432';

export const TOKEN_STORAGE_KEY = 'cinebook_token';

// Create centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global 401 handling and response extraction
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        // Dispatch custom event so AuthContext can cleanly synchronize state without full page reload
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Diagnostic helper to test backend connectivity and inspect endpoints
 */
export const checkApiHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
    return { online: true, status: res.status, data: res.data };
  } catch (error) {
    return {
      online: false,
      message: error.message,
      status: error.response?.status,
    };
  }
};

export default api;
