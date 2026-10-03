import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../../services/movieService';
import { KNOWN_GENRES } from '../../constants';
import PageHeader from '../../components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { Layers } from 'lucide-react';

const GENRE_META = {
  Action: { emoji: '💥', bg: 'from-[#8B5CF6]/14 to-[#8B5CF6]/[0.04]' },
  'Sci-Fi': { emoji: '🚀', bg: 'from-[#A78BFA]/14 to-[#A78BFA]/[0.04]' },
  Drama: { emoji: '🎭', bg: 'from-[#7C3AED]/14 to-[#7C3AED]/[0.04]' },
  Comedy: { emoji: '😂', bg: 'from-[#8B5CF6]/10 to-[#A78BFA]/[0.03]' },
  Horror: { emoji: '👻', bg: 'from-[#4C1D95]/20 to-[#0B0D12]' },
  Animation: { emoji: '🎨', bg: 'from-[#A78BFA]/12 to-[#8B5CF6]/[0.04]' },
  Thriller: { emoji: '🔪', bg: 'from-white/[0.06] to-white/[0.02]' },
  Romance: { emoji: '❤️', bg: 'from-[#A78BFA]/12 to-[#8B5CF6]/[0.04]' },
  Documentary: { emoji: '📹', bg: 'from-[#A78BFA]/12 to-[#8B5CF6]/[0.04]' },
};

export const GenresPage = () => {
  // Fetch a large page of movies and derive genre counts from real backend data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['genres-movies'],
    queryFn: () => movieService.getMovies({ page: 1, limit: 100 }),
  });

  const genreCounts = useMemo(() => {
    const counts = {};
    (data?.movies || []).forEach((m) => {
      if (m.genre) {
        counts[m.genre] = (counts[m.genre] || 0) + 1;
      }
    });
    return counts;
  }, [data]);

  // Merge backend-derived genres with known genre list (dedup, keep order)
  const genres = useMemo(() => {
    const set = new Set(KNOWN_GENRES);
    Object.keys(genreCounts).forEach((g) => set.add(g));
    return Array.from(set);
  }, [genreCounts]);

  if (isLoading) {
    return <Loader fullScreen text="Janrlar yuklanmoqda..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Layers}
        title="Janrlar"
        subtitle="Janrlar soni haqiqiy katalog ma'lumotlaridan hisoblanadi"
      />

      {error && <ErrorState title="Janrlarni yuklab bo'lmadi" message={error} onRetry={refetch} />}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((g) => {
          const meta = GENRE_META[g] || { emoji: '🎬', bg: 'from-white/[0.05] to-white/[0.01]' };
          const count = genreCounts[g] || 0;
          return (
            <Link
              key={g}
              to={`/genres/${encodeURIComponent(g)}`}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${meta.bg} border border-white/[0.08] hover:border-[#8B5CF6]/60 transition-all hover:scale-105 text-center overflow-hidden`}
            >
              <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">
                {meta.emoji}
              </span>
              <span className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">
                {g}
              </span>
              <span className="text-[11px] text-[#9CA3AF] mt-1 font-medium">
                {count > 0 ? `${count} ta film` : "Katalogda yo'q"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GenresPage;
