import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Info, Heart, Film } from 'lucide-react';

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  if (!movie) return null;

  const id = movie.id || movie._id;
  const title = movie.title || movie.name || "Noma'lum film";
  const genre = movie.genre || movie.category || "General";
  const poster = imgError || !movie.poster ? FALLBACK_POSTER : movie.poster;

  return (
    <div className="group relative bg-[#18181F] rounded-2xl overflow-hidden border border-[#27272A] hover:border-[#E50914]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E50914]/10 hover:-translate-y-1.5 flex flex-col">
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={poster}
          alt={title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181F] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Film ID Badge */}
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
            #{id}
          </span>

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(movie);
              }}
              className="pointer-events-auto p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-[#E50914] hover:scale-110 transition-all focus:outline-none"
              aria-label="Sevimlilarga qo'shish"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-[#E50914] text-[#E50914]' : 'text-white'
                }`}
              />
            </button>
          )}
        </div>

        {/* Genre badge at bottom of poster */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-[#E50914]/90 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide shadow-md">
            {genre}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <Link to={`/movies/${id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-[#FF4D5A] transition-colors line-clamp-1 title-font" title={title}>
              {title}
            </h3>
          </Link>
          {movie.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {movie.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/movies/${id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#27272A]/70 hover:bg-[#27272A] text-zinc-200 hover:text-white text-xs font-medium border border-[#27272A] transition-all"
          >
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            <span>Batafsil</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(`/movies/${id}`)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-semibold shadow-md shadow-[#E50914]/20 transition-all hover:shadow-[#E50914]/40"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Chipta olish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
