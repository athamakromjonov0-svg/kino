import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import EmptyState from '../common/EmptyState';
import { Film } from 'lucide-react';

const FAVORITES_KEY = 'cinebook_favorites';

export const MovieGrid = ({ movies = [], emptyTitle, emptyDescription }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (movie) => {
    const movieId = movie.id || movie._id;
    setFavorites((prev) => {
      const exists = prev.some((item) => (item.id || item._id) === movieId);
      let updated;
      if (exists) {
        updated = prev.filter((item) => (item.id || item._id) !== movieId);
      } else {
        updated = [...prev, movie];
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some((item) => (item.id || item._id) === movieId);
  };

  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title={emptyTitle || "Hozircha filmlar topilmadi"}
        description={emptyDescription || "Tanlangan filter yoki mezon bo'yicha filmlar mavjud emas."}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const id = movie.id || movie._id;
        return (
          <MovieCard
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

export default MovieGrid;
