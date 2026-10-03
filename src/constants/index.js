// CineBook Ultra — Global constants

export const APP_NAME = 'CineBook Ultra';
export const APP_SLOGAN = 'EVERY STORY STARTS HERE';

export const MAX_SEATS_PER_BOOKING = 4;

/**
 * Known genre list used as fallback for genre browsing UI.
 * The canonical source of genres is always the backend movie data.
 */
export const KNOWN_GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Animation',
  'Horror',
  'Thriller',
  'Romance',
  'Documentary',
];

export const STORAGE_KEYS = {
  language: 'cinebook_language',
  token: 'cinebook_token',
  watchlist: 'cinebook_watchlist',
  favorites: 'cinebook_favorites',
  recentlyViewed: 'cinebook_recently_viewed',
  recentSearches: 'cinebook_recent_searches',
  playbackProgress: 'cinebook_playback_progress',
  settings: 'cinebook_settings',
};

/**
 * Video source types supported by the streaming architecture.
 * Only lawful sources are allowed — never pirated content.
 */
export const VIDEO_SOURCE_TYPES = {
  HLS: 'hls',
  MP4: 'mp4',
  EMBED: 'embed',
  TRAILER: 'trailer',
};

export const SORT_OPTIONS = ['popularity', 'title', 'newest', 'rating'];
