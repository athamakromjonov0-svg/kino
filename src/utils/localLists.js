/**
 * Device-local movie lists (localStorage).
 *
 * NOTE: These lists are DEVICE-LOCAL only. They are clearly labeled as such in
 * the UI because the CineBook backend does not provide server-side
 * watchlist/favorites endpoints yet.
 *
 * Storage formats are kept compatible with MovieDetails.jsx which writes
 * `cinebook_favorites` and `cinebook_recent_movies` as arrays of movie objects.
 */

export const LOCAL_LIST_KEYS = {
  favorites: 'cinebook_favorites',
  watchlist: 'cinebook_watchlist_movies',
  recentlyViewed: 'cinebook_recent_movies',
};

/** Custom event used to sync all list consumers after any mutation */
export const LISTS_CHANGED_EVENT = 'cinebook:lists-changed';

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage full or unavailable — list stays in-memory for this session */
  }
  window.dispatchEvent(new CustomEvent(LISTS_CHANGED_EVENT, { detail: { key } }));
}

const movieId = (m) => String(m?.id ?? m?._id ?? '');

export const localLists = {
  get: (key) => readList(key),

  has: (key, id) => readList(key).some((m) => movieId(m) === String(id)),

  toggle(key, movie) {
    const list = readList(key);
    const exists = list.some((m) => movieId(m) === movieId(movie));
    const next = exists
      ? list.filter((m) => movieId(m) !== movieId(movie))
      : [{ id: movie.id ?? movie._id, title: movie.title, poster: movie.poster, genre: movie.genre }, ...list];
    writeList(key, next);
    return !exists; // true → now added
  },

  remove(key, id) {
    writeList(key, readList(key).filter((m) => movieId(m) !== String(id)));
  },

  clear(key) {
    writeList(key, []);
  },
};

export default localLists;
