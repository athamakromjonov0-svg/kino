import api from './api';

/**
 * Collections service — curated movie collections.
 * Backend extension endpoints (documented in README):
 *   GET /collections
 *   GET /collections/:id
 */
export const collectionService = {
  async getCollections() {
    const response = await api.get('/collections');
    const resData = response.data;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.collections)) return resData.collections;
    return [];
  },

  async getCollectionById(id) {
    const response = await api.get(`/collections/${id}`);
    return response.data?.data || response.data;
  },
};

export default collectionService;
