import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Heart, Play, ExternalLink } from 'lucide-react';
import { ARCHIVE_DETAILS_URL } from '../../services/archiveService';

const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

const formatDownloads = (count) => {
  if (!count) return null;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M yuklab olish`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K yuklab olish`;
  return `${count} yuklab olish`;
};

/**
 * ArchiveMovieCard — same look & feel as MovieCard, but every action points at
 * the in-app archive detail page (`/catalog/archive/:identifier`) instead of
 * `/movies/:id`, which only knows about the local backend catalog.
 */
export const ArchiveMovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  if (!movie) return null;

  const id = movie.identifier || movie.id || movie._id;
  const title = movie.title || "Noma'lum film";
  const genre = movie.genre || 'Feature Film';
  const poster = imgError || !movie.poster ? FALLBACK_POSTER : movie.poster;
  const detailPath = `/catalog/archive/${encodeURIComponent(id)}`;
  const downloads = formatDownloads(movie.downloads);

  return (
    <div className="group relative bg-[#18181F] rounded-2xl overflow-hidden border border-[#27272A] hover:border-[#E50914]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E50914]/10 hover:-translate-y-1.5 flex flex-col">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={poster}
          alt={title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#18181F] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
            IA
          </span>

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
                className={`w-4 h-4 ${isFavorite ? 'fill-[#E50914] text-[#E50914]' : 'text-white'}`}
              />
            </button>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#E50914]/90 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide shadow-md">
            {genre}
          </span>
          {movie.year ? (
            <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-zinc-200">
              {movie.year}
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <Link to={detailPath}>
            <h3
              className="text-base font-bold text-white group-hover:text-[#FF4D5A] transition-colors line-clamp-1"
              title={title}
            >
              {title}
            </h3>
          </Link>
          {movie.description ? (
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {movie.description}
            </p>
          ) : null}
          {downloads ? (
            <p className="text-[11px] text-zinc-500 mt-1.5">{downloads}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={detailPath}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#27272A]/70 hover:bg-[#27272A] text-zinc-200 hover:text-white text-xs font-medium border border-[#27272A] transition-all"
          >
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            <span>Batafsil</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(detailPath)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-semibold shadow-md shadow-[#E50914]/20 transition-all hover:shadow-[#E50914]/40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Tomosha</span>
          </button>
        </div>

        <a
          href={`${ARCHIVE_DETAILS_URL}/${encodeURIComponent(id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 hover:text-[#FF4D5A] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span>archive.org manbasi</span>
        </a>
      </div>
    </div>
  );
};

export default ArchiveMovieCard;
