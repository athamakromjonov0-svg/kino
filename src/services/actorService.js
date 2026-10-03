import api from './api';

/**
 * Actors service.
 * Backend extension endpoints (documented in README):
 *   GET /actors?page=1&limit=12
 *   GET /actors/:id
 * If backend does not provide these endpoints, the UI shows an
 * explicit "backend extension required" state instead of faking data.
 */
export const actorService = {
  async getActors(params = {}) {
    const queryParams = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;

    const response = await api.get('/actors', { params: queryParams });
    const resData = response.data;

    // Standard format: { data: [...], page, limit, total, totalPages }
    if (resData && Array.isArray(resData.data)) {
      return {
        actors: resData.data,
        page: Number(resData.page) || 1,
        total: Number(resData.total) || resData.data.length,
        totalPages: Number(resData.totalPages) || 1,
      };
    }

    // Direct array
    if (Array.isArray(resData)) {
      return {
        actors: resData,
        page: Number(params.page) || 1,
        total: resData.length,
        totalPages: 1,
      };
    }

    return { actors: [], page: 1, total: 0, totalPages: 1 };
  },

  async getActorById(id) {
    const response = await api.get(`/actors/${id}`);
    return response.data?.data || response.data;
  },
};

export default actorService;
