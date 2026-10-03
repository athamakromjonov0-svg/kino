import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService from '../../services/movieService';
import PageHeader from '../../components/common/PageHeader';
import MovieGrid from '../../components/movies/MovieGrid';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TrendingUp, Flame, Star, CalendarClock, ArrowUpDown } from 'lucide-react';

const VARIANTS = {
  trending: {
    icon: Flame,
    title: 'Trenddagi Filmlar',
    subtitle: "Platformada eng ko'p qiziqish uyg'otayotgan filmlar",
  },
  popular: {
    icon: TrendingUp,
    title: 'Ommabop Filmlar',
    subtitle: 'Tomoshabinlar orasida eng mashhur filmlar',
  },
  'top-rated': {
    icon: Star,
    title: 'Eng Yuqori Reytingli',
    subtitle: 'Reyting manbasi: platforma katalog ma\'lumotlari',
  },
  upcoming: {
    icon: CalendarClock,
    title: 'Tez Orada',
    subtitle: 'Chiqarilish sanasi e\'lon qilingan va rejalashtirilgan premyeralar',
  },
};

/**
 * Shared catalog page used by /trending, /popular, /top-rated, /upcoming routes.
 * Sorting is performed client-side over the real backend catalog data —
 * no fake per-variant metrics are invented.
 */
export const CatalogPage = ({ variant = 'trending' }) => {
  const params = VARIANTS[variant] || VARIANTS.trending;
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('desc');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['catalog-movies'],
    queryFn: () => movieService.getMovies({ page: 1, limit: 100 }),
  });

  const movies = useMemo(() => {
    const list = [...(data?.movies || [])];
    if (variant === 'top-rated') {
      list.sort((a, b) => {
        const ra = a.rating ?? a.vote_average ?? 0;
        const rb = b.rating ?? b.vote_average ?? 0;
        return sortOrder === 'desc' ? rb - ra : ra - rb;
      });
    } else if (variant === 'upcoming') {
      // Movies without a known release date are grouped at the end and flagged
      list.sort((a, b) => {
        const da = a.releaseDate || a.release_date || null;
        const db = b.releaseDate || b.release_date || null;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return sortOrder === 'desc'
          ? new Date(db) - new Date(da)
          : new Date(da) - new Date(db);
      });
    }
    return list;
  }, [data, variant, sortOrder]);

  const Icon = params.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Icon}
        title={params.title}
        subtitle={params.subtitle}
        badge={
          variant === 'top-rated' || variant === 'upcoming' ? (
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === 'desc' ? 'Kamayish tartibida' : 'O\'sish tartibida'}
            </button>
          ) : null
        }
      />

      {isLoading ? (
        <MovieGridSkeleton count={8} />
      ) : error ? (
        <ErrorState title="Katalogni yuklab bo'lmadi" message={error} onRetry={refetch} />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={Icon}
          title="Filmlar topilmadi"
          description="Katalogda hozircha filmlar mavjud emas."
          actionText="Bosh sahifaga qaytish"
          onAction={() => navigate('/')}
        />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default CatalogPage;
