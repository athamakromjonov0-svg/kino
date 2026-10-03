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
    <div className="group relative bg-[#171A22] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/45 transition-all duration-300 ease-premium hover:shadow-[0_18px_45px_-18px_rgba(139,92,246,0.4)] hover:shadow-lift-violet hover:-translate-y-1.5 flex flex-col">
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0B0D12]">
        <img
          src={poster}
          alt={title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.06]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171A22] via-[#171A22]/10 to-black/50 opacity-90 transition-opacity duration-300 ease-premium" />

        {/* Violet rim on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#8B5CF6]/0 group-hover:ring-[#8B5CF6]/35 transition-all duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Film ID Badge */}
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#D1D5DB]">
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
              className="pointer-events-auto p-2 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-[#F8FAFC] hover:text-[#A78BFA] hover:bg-black/70 hover:scale-110 transition-all duration-200 focus:outline-none"
              aria-label="Sevimlilarga qo'shish"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-[#8B5CF6] text-[#8B5CF6]' : 'text-[#F8FAFC]'
                }`}
              />
            </button>
          )}
        </div>

        {/* Genre badge at bottom of poster */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/85 backdrop-blur-md border border-white/[0.12] text-[11px] font-semibold text-[#F8FAFC] tracking-wide shadow-[0_2px_10px_-2px_rgba(139,92,246,0.8)]">
            {genre}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <Link to={`/movies/${id}`}>
            <h3 className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors duration-200 line-clamp-1" title={title}>
              {title}
            </h3>
          </Link>
          {movie.description && (
            <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1 leading-relaxed">
              {movie.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/movies/${id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-[#E5E7EB] hover:text-[#F8FAFC] text-xs font-medium border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 ease-premium"
          >
            <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Batafsil</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(`/movies/${id}`)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] text-xs font-semibold shadow-[0_6px_18px_-6px_rgba(139,92,246,0.7)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_8px_24px_-4px_rgba(139,92,246,0.85)]"
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
