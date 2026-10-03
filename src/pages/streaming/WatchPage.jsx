import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService from '../../services/movieService';
import streamingService from '../../services/streamingService';
import VideoPlayer from '../../components/streaming/VideoPlayer';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { MovieCardSkeleton } from '../../components/common/Skeleton';
import MovieCard from '../../components/movies/MovieCard';
import useAuth from '../../hooks/useAuth';
import { useLocalList } from '../../hooks/useLocalList';
import { LOCAL_LIST_KEYS } from '../../utils/localLists';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Play, ArrowLeft, ShieldCheck, Info, ListPlus, Heart, Film, MonitorPlay,
} from 'lucide-react';

/**
 * WatchPage — streaming entry point.
 * The player NEVER pretends a video exists: when the backend returns
 * source: null, an explicit "Streaming unavailable" state is shown and the
 * user is offered the lawful alternative (official trailer / movie page).
 */
export const WatchPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { items: favorites, toggle: toggleFavorite, has: isFavorite } = useLocalList(LOCAL_LIST_KEYS.favorites);

  // Movie metadata
  const movieQuery = useQuery({
    queryKey: ['watch-movie', movieId],
    queryFn: () => movieService.getMovieById(movieId),
    retry: 1,
  });

  // Lawful streaming source (may be null = unavailable)
  const sourceQuery = useQuery({
    queryKey: ['streaming-source', movieId],
    queryFn: () => streamingService.getSource(movieId),
    retry: 0,
  });

  // Set page title
  useEffect(() => {
    if (movieQuery.data?.title) {
      document.title = `${movieQuery.data.title} — Cineora`;
    }
    return () => {
      document.title = 'Cineora';
    };
  }, [movieQuery.data]);

  const movie = movieQuery.data;
  const source = sourceQuery.data;

  if (movieQuery.isLoading || sourceQuery.isLoading) {
    return <Loader fullScreen text="Video manbasi tekshirilmoqda..." />;
  }

  if (movieQuery.error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Film ma'lumotlarini yuklab bo'lmadi"
          message={getErrorMessage(movieQuery.error)}
          onRetry={() => movieQuery.refetch()}
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Film}
          title="Film topilmadi"
          description={`ID: #${movieId} film mavjud emas.`}
          actionText="Katalogga qaytish"
          onAction={() => navigate('/movies')}
        />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <button
          type="button"
          onClick={() => navigate(`/movies/${movie.id}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Film sahifasiga qaytish</span>
        </button>

        {/* Player or explicit unavailable state */}
        {source ? (
          <VideoPlayer source={source} movieTitle={movie.title} />
        ) : (
          <div className="relative w-full aspect-video rounded-2xl bg-[#121216] border border-[#27272A] overflow-hidden flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-[#18181F] border border-[#27272A] flex items-center justify-center">
              <MonitorPlay className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-xl font-bold text-white">Streaming mavjud emas</h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Ushbu film uchun hozircha qonuniy video manba ulanmagan. Biz ruxsatsiz
                nusxalarni ko'rsatmaymiz — faqat litsenziyalangan yoki ommaviy manbalarni.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {movie.trailerUrl && (
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Rasmiy treylerni ko'rish
                </button>
              )}
              <Link
                to="/movies"
                className="px-5 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Boshqa filmlar
              </Link>
            </div>
          </div>
        )}

        {/* Trailer embed (lawful official source) */}
        {isTrailerOpen && movie.trailerUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#27272A] bg-black">
            <iframe
              src={movie.trailerUrl}
              title={`${movie.title} — treyler`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}

        {/* Movie info under player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {movie.genre && (
                <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider">
                  {movie.genre}
                </span>
              )}
              {source?.ageRating && (
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  {source.ageRating}
                </span>
              )}
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Qonuniy manba orqali
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {movie.title}
            </h1>
            {movie.description && (
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => toggleFavorite(movie)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isFavorite(movie.id)
                    ? 'bg-red-950/40 border-red-500/50 text-[#FF4D5A]'
                    : 'bg-[#18181F] border-[#27272A] text-zinc-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(movie.id) ? 'fill-[#FF4D5A]' : ''}`} />
                {isFavorite(movie.id) ? 'Sevimlilarda' : 'Sevimlilarga'}
              </button>
              {!isAuthenticated && (
                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Bron va shaxsiy ro'yxatlar uchun tizimga kiring
                </span>
              )}
            </div>
          </div>

          {/* Watchlist side card */}
          <div className="lg:col-span-4">
            <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-[#FF4D5A]" />
                Keyinroq ko'rish
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Filmni watchlist'ga qo'shing — ro'yxat qurilmangizda (localStorage)
                saqlanadi, serverga yuborilmaydi.
              </p>
              <Link
                to="/watchlist"
                className="block text-center px-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
              >
                Watchlist'ni ochish
              </Link>
            </div>
          </div>
        </div>

        {/* Similar movies (simple metadata-based) */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-[#27272A] pb-4">
            O'xshash filmlar (janr bo'yicha)
          </h2>
          <SimilarMovies genre={movie.genre} currentId={movie.id} />
        </section>
      </div>
    </div>
  );
};

/** Simple metadata-based similar movies (same genre) — honestly labeled */
const SimilarMovies = ({ genre, currentId }) => {
  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    movieService
      .getMovies({ genre: genre || 'all', page: 1, limit: 12 })
      .then((res) => {
        if (mounted) setMovies((res.movies || []).filter((m) => String(m.id) !== String(currentId)).slice(0, 4));
      })
      .catch(() => {
        if (mounted) setMovies([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [genre, currentId]);

  if (isLoading) return <MovieGridSkeleton count={4} />;
  if (!movies || movies.length === 0) {
    return <p className="text-xs text-zinc-500">O'xshash filmlar topilmadi.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
};

export default WatchPage;
