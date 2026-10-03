import axios from 'axios';

// API base URL resolution (3 usul, ustuvorlik tartibida):
//
//  1. VITE_API_URL berilgan bo'lsa — aynan shu manzil ishlatiladi
//     (frontend va API alohida deploy qilingan holat).
//  2. Berilmagan bo'lsa va production build — same-origin, ya'ni bo'sh
//     baseURL. Render'da frontend va API bitta domen ostida ishlaydi,
//     shuning uchun frontend o'zi o'z API'siga ulanadi (CORS ham yo'q).
//  3. Development build — lokal mock server (localhost:5432).
const configuredBaseUrl = (import.meta.env.VITE_API_URL || '').trim();
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = configuredBaseUrl || (isProduction ? '' : 'http://localhost:5432');

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
    // dist/ bilan birlashtirilgan rejimda "/" frontend SPA, shuning uchun
    // health endpoint alohida "/api/health" da joylashgan.
    const healthPath = isProduction ? '/api/health' : '/';
    const res = await axios.get(`${API_BASE_URL}${healthPath}`, { timeout: 3000 });
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
