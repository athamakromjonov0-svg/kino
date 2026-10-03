import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService from '../../services/movieService';
import SessionCard from '../../components/booking/SessionCard';
import PageHeader from '../../components/common/PageHeader';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Clock, Film, Search } from 'lucide-react';

/**
 * Sessions catalog — built from real sessions attached to backend movies
 * (GET /movies). The backend has no standalone /sessions list endpoint yet,
 * so no fake standalone sessions are invented here.
 */
export const SessionsPage = () => {
  const navigate = useNavigate();
  const [movieFilter, setMovieFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions-movies'],
    queryFn: () => movieService.getMovies({ page: 1, limit: 100 }),
  });

  const movies = useMemo(() => data?.movies || [], [data]);

  const allSessions = useMemo(() => {
    const sessions = [];
    movies.forEach((m) => {
      (m.sessions || []).forEach((s) => {
        sessions.push({ ...s, movie: m });
      });
    });
    return sessions.sort((a, b) => {
      const ta = a.time || a.date || a.startTime;
      const tb = b.time || b.date || b.startTime;
      if (!ta && !tb) return 0;
      if (!ta) return 1;
      if (!tb) return -1;
      return new Date(ta) - new Date(tb);
    });
  }, [movies]);

  const movieOptions = useMemo(
    () => movies.map((m) => ({ id: m.id || m._id, title: m.title })),
    [movies]
  );

  const filteredSessions = useMemo(() => {
    let list = allSessions;
    if (movieFilter !== 'all') {
      list = list.filter((s) => String(s.movie?.id || s.movie?._id) === String(movieFilter));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          (s.movie?.title || '').toLowerCase().includes(term) ||
          (s.hall || '').toLowerCase().includes(term)
      );
    }
    return list;
  }, [allSessions, movieFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Clock}
        title="Kino Seanslari"
        subtitle={`Barcha mavjud seanslar (${filteredSessions.length} ta)`}
      />

      {/* Filters */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Film yoki zal bo'yicha qidirish..."
            className="w-full bg-[#18181F] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#27272A] focus:border-[#E50914] focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Film className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
            className="w-full sm:w-56 bg-[#18181F] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#27272A] focus:border-[#E50914] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">Barcha filmlar</option>
            {movieOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#18181F] rounded-2xl animate-pulse border border-[#27272A]" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Seanslarni yuklab bo'lmadi" message={error} onRetry={refetch} />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Seanslar topilmadi"
          description="Tanlangan filter bo'yicha seanslar mavjud emas. Filmlar sahifalaridan seanslarni tekshirib ko'ring."
          actionText="Filmlar katalogiga"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session, index) => (
            <div key={session.id || index} className="space-y-1.5">
              <div className="px-1 flex items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  {session.movie?.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#27272A] text-[10px] font-semibold text-zinc-300">
                  {session.movie?.genre}
                </span>
              </div>
              <SessionCard session={session} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
