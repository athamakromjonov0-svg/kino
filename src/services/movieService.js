import api from './api';

export const movieService = {
  /**
   * Get paginated movies list with optional genre filtering
   * GET /movies?genre=action&page=1&limit=6
   * @param {{ genre?: string, page?: number, limit?: number }} params
   */
  async getMovies(params = {}) {
    const queryParams = {};
    if (params.genre && params.genre !== 'all') {
      queryParams.genre = params.genre;
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.limit = params.limit;
    }

    const response = await api.get('/movies', { params: queryParams });
    const resData = response.data;

    // Normalization to ensure stable interface:
    // If backend returns standard format: { data: [...], page, limit, total, totalPages }
    if (resData && Array.isArray(resData.data)) {
      return {
        movies: resData.data,
        page: Number(resData.page) || 1,
        limit: Number(resData.limit) || (resData.data.length || 6),
        total: Number(resData.total) || resData.data.length,
        totalPages: Number(resData.totalPages) || Math.ceil((resData.total || resData.data.length) / (resData.limit || 6)) || 1,
      };
    }

    // If backend returns array directly: [...]
    if (Array.isArray(resData)) {
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 6;
      return {
        movies: resData,
        page,
        limit,
        total: resData.length,
        totalPages: Math.ceil(resData.length / limit) || 1,
      };
    }

    // Fallback if data is in another property
    return {
      movies: resData?.movies || [],
      page: 1,
      limit: 6,
      total: 0,
      totalPages: 1,
    };
  },

  /**
   * Get single movie details and its sessions
   * GET /movies/:id
   * @param {string|number} id
   */
  async getMovieById(id) {
    const response = await api.get(`/movies/${id}`);
    const data = response.data?.data || response.data;
    return data;
  },
};

export default movieService;
