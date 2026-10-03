import api from './api';

/**
 * Reviews service.
 * Backend extension endpoints (documented in README):
 *   GET /reviews?movieId=1
 *   POST /reviews  { movieId, text, rating? }   (auth required)
 * If backend lacks these, the UI shows an explicit
 * "reviews API not available in backend" state.
 */
export const reviewService = {
  async getReviews(params = {}) {
    const queryParams = {};
    if (params.movieId) queryParams.movieId = params.movieId;

    const response = await api.get('/reviews', { params: queryParams });
    const resData = response.data;

    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.reviews)) return resData.reviews;
    return [];
  },

  async createReview({ movieId, text, rating }) {
    const payload = { movieId: Number(movieId), text: String(text).slice(0, 2000) };
    if (rating !== undefined && rating !== null && rating !== '') {
      payload.rating = Number(rating);
    }
    const response = await api.post('/reviews', payload);
    return response.data;
  },
};

export default reviewService;
