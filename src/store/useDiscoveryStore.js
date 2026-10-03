import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

/**
 * Recently viewed movies, recent searches and playback progress.
 * All device-local (localStorage) features.
 */
export const useDiscoveryStore = create(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      recentSearches: [],
      playbackProgress: {},

      addRecentlyViewed: (movie) =>
        set((state) => ({
          recentlyViewed: [
            { id: movie.id, title: movie.title, poster: movie.poster, genre: movie.genre },
            ...state.recentlyViewed.filter((m) => m.id !== movie.id),
          ].slice(0, 12),
        })),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter((q) => q !== query)].slice(0, 8),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      /**
       * Streaming resume support. progress in seconds; duration in seconds.
       */
      savePlaybackProgress: (movieId, progress, duration) =>
        set((state) => ({
          playbackProgress: {
            ...state.playbackProgress,
            [movieId]: { progress, duration, updatedAt: Date.now() },
          },
        })),

      getPlaybackProgress: (movieId) => get().playbackProgress[movieId] || null,

      clearPlaybackProgress: (movieId) =>
        set((state) => {
          const next = { ...state.playbackProgress };
          delete next[movieId];
          return { playbackProgress: next };
        }),
    }),
    {
      name: STORAGE_KEYS.playbackProgress,
    }
  )
);

export default useDiscoveryStore;
