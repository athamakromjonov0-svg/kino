import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Star, ArrowUpDown, Film } from 'lucide-react';
import reviewService from '../../services/reviewService';
import movieService from '../../services/movieService';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDateTime } from '../../utils/formatDate';

/**
 * ReviewsPage — all user reviews.
 * Reviews can be created only if the backend reviews API exists (POST /reviews).
 */
export const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [movieFilter, setMovieFilter] = useState('all');
  const [sortDesc, setSortDesc] = useState(true);
  const [movies, setMovies] = useState([]);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    // Load movies for the "filter by movie" select (best effort)
    movieService
      .getMovies({ page: 1, limit: 50 })
      .then((res) => setMovies(res.movies || []))
      .catch(() => {});
  }, [fetchReviews]);

  const movieTitle = useCallback(
    (movieId) => movies.find((m) => String(m.id) === String(movieId))?.title || `Film #${movieId}`,
    [movies]
  );

  const filtered = useMemo(() => {
    let list = reviews;
    if (movieFilter !== 'all') {
      list = list.filter((r) => String(r.movieId) === String(movieFilter));
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) => (r.text || '').toLowerCase().includes(q) || (r.user || '').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return sortDesc ? db - da : da - db;
    });
  }, [reviews, query, movieFilter, sortDesc]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={MessageSquare}
        title="Sharhlar"
        subtitle="Tomoshabinlarning filmlar haqidagi fikrlari"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
            {reviews.length} ta sharh
          </span>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sharhlar ichidan qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]/60"
          />
        </div>
        <select
          value={movieFilter}
          onChange={(e) => setMovieFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-sm text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]/60"
        >
          <option value="all">Barcha filmlar</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSortDesc(!sortDesc)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortDesc ? 'Eng yangi' : 'Eng eski'}
        </button>
      </div>

      {isLoading ? (
        <Loader text="Sharhlar yuklanmoqda..." />
      ) : error ? (
        <ErrorState title="Sharhlarni yuklab bo'lmadi" message={error} onRetry={fetchReviews} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Sharhlar topilmadi"
          description="Hozircha sharhlar mavjud emas. Film sahifasidan birinchi sharhni yozing!"
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <article
              key={r.id || `${r.movieId}-${r.createdAt}`}
              className="bg-[#171A22] border border-white/[0.08] hover:border-[#8B5CF6]/40 rounded-2xl p-5 sm:p-6 space-y-3 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[#F8FAFC] text-xs font-bold uppercase">
                    {(r.user || 'A').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F8FAFC]">{r.user || 'Anonim'}</p>
                    <p className="text-[11px] text-[#6B7280]">{formatDateTime(r.createdAt)}</p>
                  </div>
                </div>
                {r.rating != null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F59E0B]/[0.12] border border-[#F59E0B]/[0.3] text-[#FBBF24] text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#FBBF24]" />
                    {r.rating}/10
                  </span>
                )}
              </div>

              <p className="text-sm text-[#D1D5DB] leading-relaxed">{r.text}</p>

              <Link
                to={`/movies/${r.movieId}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] hover:text-[#F8FAFC] transition-colors"
              >
                <Film className="w-3.5 h-3.5" />
                {movieTitle(r.movieId)}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
