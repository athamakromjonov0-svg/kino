import api from './api';

/**
 * Streaming service.
 * Backend extension endpoint (documented in README):
 *   GET /streaming/:movieId  →  { source: { type, url, label, license, ageRating } | null }
 *
 * IMPORTANT: `source: null` means NO lawful video source is available.
 * The UI must then show an explicit "Streaming unavailable" state and never
 * pretend a video exists. Only lawful sources (public samples, licensed
 * providers, official embeds) may be configured here.
 */
export const streamingService = {
  async getSource(movieId) {
    const response = await api.get(`/streaming/${movieId}`);
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'source' in resData) {
      return resData.source;
    }
    return resData || null;
  },
};

export default streamingService;
