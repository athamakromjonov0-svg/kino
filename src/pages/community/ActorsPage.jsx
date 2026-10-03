import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ChevronLeft, ChevronRight, Clapperboard } from 'lucide-react';
import actorService from '../../services/actorService';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { getErrorMessage } from '../../utils/errorHandler';

const FALLBACK_PORTRAIT = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

/**
 * ActorsPage — actor catalog with search over loaded results + pagination.
 * Data comes from the backend extension endpoint GET /actors.
 */
export const ActorsPage = () => {
  const navigate = useNavigate();
  const [actors, setActors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const fetchActors = useCallback(async (p) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await actorService.getActors({ page: p, limit: 12 });
      setActors(data.actors || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(getErrorMessage(err));
      setActors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActors(page);
  }, [fetchActors, page]);

  const filtered = query
    ? actors.filter((a) => (a.name || '').toLowerCase().includes(query.toLowerCase()))
    : actors;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Users}
        title="Aktyorlar"
        subtitle="Kino olamining mashhur yuzlari"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
            {total} ta aktyor
          </span>
        }
      />

      {/* Search (within loaded page) */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Aktyor ismi bo'yicha qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]/60"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Aktyorlarni yuklab bo'lmadi" message={error} onRetry={() => fetchActors(page)} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aktyorlar topilmadi"
          description="Backendda aktyorlar katalogi hozircha bo'sh yoki endpoint mavjud emas."
          actionText="Filmlarga qaytish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filtered.map((actor) => (
              <button
                key={actor.id || actor._id}
                type="button"
                onClick={() => navigate(`/actors/${actor.id || actor._id}`)}
                className="group text-left focus:outline-none"
              >
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#27272A] group-hover:border-[#E50914]/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-[#E50914]/10 bg-zinc-900">
                  <img
                    src={actor.image || actor.photo || FALLBACK_PORTRAIT}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <Clapperboard className="w-3 h-3" />
                      {actor.knownFor || 'Kino'}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white group-hover:text-[#FF4D5A] transition-colors truncate">
                  {actor.name}
                </h3>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white transition-colors"
                aria-label="Oldingi sahifa"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-400 font-semibold">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white transition-colors"
                aria-label="Keyingi sahifa"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActorsPage;
