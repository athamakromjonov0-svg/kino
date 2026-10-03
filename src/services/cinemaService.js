import api from './api';

/**
 * Cinema catalog service.
 * Backend extension endpoints (documented in README):
 *   GET /cinemas
 *   GET /cinemas/:id
 * Reference/sample catalog — NOT a live booking service.
 */
export const cinemaService = {
  async getCinemas() {
    const response = await api.get('/cinemas');
    const resData = response.data;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    return [];
  },

  async getCinemaById(id) {
    const response = await api.get(`/cinemas/${id}`);
    return response.data?.data || response.data;
  },
};

export default cinemaService;
