import React, { useState } from 'react';
import ArchiveMovieCard from './ArchiveMovieCard';
import EmptyState from '../common/EmptyState';
import { Clapperboard } from 'lucide-react';

const FAVORITES_KEY = 'cinebook_favorites';

/**
 * Grid of Internet Archive films. Favorites reuse the same localStorage list
 * as the main catalog so the heart state stays consistent across the app.
 */
export const ArchiveMovieGrid = ({ movies = [], emptyTitle, emptyDescription }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (movie) => {
    const movieId = movie.identifier || movie.id || movie._id;
    setFavorites((prev) => {
      const exists = prev.some((item) => (item.identifier || item.id || item._id) === movieId);
      const updated = exists
        ? prev.filter((item) => (item.identifier || item.id || item._id) !== movieId)
        : [...prev, movie];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (movieId) =>
    favorites.some((item) => (item.identifier || item.id || item._id) === movieId);

  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        icon={Clapperboard}
        title={emptyTitle || 'Filmlar topilmadi'}
        description={emptyDescription || 'Qidiruv so\'zini o\'zgartirib ko\'ring yoki boshqa sahifaga o\'ting.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {movies.map((movie) => {
        const id = movie.identifier || movie.id || movie._id;
        return (
          <ArchiveMovieCard
            key={id}
            movie={movie}
            isFavorite={isFavorite(id)}
            onToggleFavorite={toggleFavorite}
          />
        );
      })}
    </div>
  );
};

export default ArchiveMovieGrid;
