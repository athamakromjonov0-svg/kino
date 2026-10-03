import api, { TOKEN_STORAGE_KEY } from './api';

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   * @param {{ name: string, email: string, password: string }} data
   */
  async register(data) {
    const response = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  /**
   * Login user
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    // Support { token: "..." } or { data: { token: "..." } }
    const token = response.data?.token || response.data?.data?.token;
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    return response.data;
  },

  /**
   * Fetch current authenticated user
   * GET /auth/me
   */
  async getMe() {
    const response = await api.get('/auth/me');
    // Normalize response: backend might return { user: {...} }, { data: {...} }, or directly user object
    const user = response.data?.user || response.data?.data || response.data;
    return user;
  },

  /**
   * Clear session token and logout
   */
  logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Get current stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Check if token exists in storage
   */
  hasToken() {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  }
};

export default authService;
