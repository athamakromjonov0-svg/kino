import api from './api';

/**
 * Admin service.
 * All endpoints here are BACKEND EXTENSIONS (admin role required),
 * documented in README. If the real backend lacks them, the UI shows
 * an explicit error state instead of faking success.
 *
 *   GET    /admin/stats
 *   GET    /users?page=1&limit=10
 *   POST   /movies                { title, genre, description, poster }
 *   PUT    /movies/:id
 *   DELETE /movies/:id
 *   GET    /sessions              (all sessions, enriched)
 *   POST   /sessions              { movieId, hall, time }
 *   PUT    /sessions/:id          { movieId, hall, time }
 *   DELETE /sessions/:id
 *   GET    /bookings              (all bookings, admin overview)
 */

const unwrapList = (resData) => {
  if (Array.isArray(resData)) return { items: resData, total: resData.length, totalPages: 1 };
  if (Array.isArray(resData?.data)) {
    return {
      items: resData.data,
      total: Number(resData.total) || resData.data.length,
      totalPages: Number(resData.totalPages) || 1,
    };
  }
  return { items: [], total: 0, totalPages: 1 };
};

export const adminService = {
  // ==================== STATS ====================
  async getStats() {
    const response = await api.get('/admin/stats');
    const data = response.data?.data || response.data;
    return {
      isDemoPreview: Boolean(data?.isDemoPreview),
      totalMovies: data?.totalMovies ?? 0,
      totalUsers: data?.totalUsers ?? 0,
      totalBookings: data?.totalBookings ?? 0,
      activeSessions: data?.activeSessions ?? 0,
      bookingsOverTime: Array.isArray(data?.bookingsOverTime) ? data.bookingsOverTime : [],
      popularMovies: Array.isArray(data?.popularMovies) ? data.popularMovies : [],
      userGrowth: Array.isArray(data?.userGrowth) ? data.userGrowth : [],
    };
  },

  // ==================== USERS ====================
  async getUsers(params = {}) {
    const queryParams = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;

    const response = await api.get('/users', { params: queryParams });
    const resData = response.data;
    return unwrapList(resData);
  },

  // ==================== MOVIES CRUD ====================
  async createMovie(payload) {
    const response = await api.post('/movies', payload);
    return response.data?.data || response.data;
  },

  async updateMovie(id, payload) {
    const response = await api.put(`/movies/${id}`, payload);
    return response.data?.data || response.data;
  },

  async deleteMovie(id) {
    const response = await api.delete(`/movies/${id}`);
    return response.data?.data || response.data;
  },

  // ==================== SESSIONS ====================
  async getAllSessions() {
    const response = await api.get('/sessions');
    const resData = response.data;
    return unwrapList(resData);
  },

  async createSession(payload) {
    const response = await api.post('/sessions', payload);
    return response.data?.data || response.data;
  },

  async updateSession(id, payload) {
    const response = await api.put(`/sessions/${id}`, payload);
    return response.data?.data || response.data;
  },

  async deleteSession(id) {
    const response = await api.delete(`/sessions/${id}`);
    return response.data?.data || response.data;
  },

  // ==================== BOOKINGS (ALL) ====================
  async getAllBookings() {
    const response = await api.get('/bookings');
    const resData = response.data;
    return unwrapList(resData);
  },
};

export default adminService;
