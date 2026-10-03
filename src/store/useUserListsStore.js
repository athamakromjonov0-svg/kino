import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

/**
 * Watchlist & Favorites — purely frontend features.
 * Clearly labeled as device-local, not server-saved.
 */
export const useUserListsStore = create(
  persist(
    (set, get) => ({
      watchlist: [],
      favorites: [],

      isInWatchlist: (movieId) => get().watchlist.includes(movieId),
      isFavorite: (movieId) => get().favorites.includes(movieId),

      toggleWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.includes(movieId)
            ? state.watchlist.filter((id) => id !== movieId)
            : [...state.watchlist, movieId],
        })),

      toggleFavorite: (movieId) =>
        set((state) => ({
          favorites: state.favorites.includes(movieId)
            ? state.favorites.filter((id) => id !== movieId)
            : [...state.favorites, movieId],
        })),
    }),
    {
      name: STORAGE_KEYS.watchlist,
    }
  )
);

export default useUserListsStore;
