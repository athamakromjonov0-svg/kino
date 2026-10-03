import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService from '../../services/movieService';
import PageHeader from '../../components/common/PageHeader';
import MovieGrid from '../../components/movies/MovieGrid';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { ChevronLeft, Layers } from 'lucide-react';

export const GenreDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const genre = decodeURIComponent(slug || '');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['genre-movies', genre],
    queryFn: () => movieService.getMovies({ genre, page: 1, limit: 100 }),
  });

  const movies = useMemo(() => data?.movies || [], [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <button
        type="button"
        onClick={() => navigate('/genres')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Barcha janrlar</span>
      </button>

      <PageHeader
        icon={Layers}
        title={`${genre} filmlari`}
        subtitle={`"${genre}" janridagi barcha filmlar (${movies.length} ta)`}
      />

      {isLoading ? (
        <MovieGridSkeleton count={8} />
      ) : error ? (
        <ErrorState title="Filmlarni yuklab bo'lmadi" message={error} onRetry={refetch} />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Ushbu janrda filmlar topilmadi"
          description="Katalogda bu janr bo'yicha hozircha film mavjud emas."
          actionText="Barcha filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <MovieGrid movies={movies} />
      )}

      <div className="text-center">
        <Link
          to={`/movies?genre=${encodeURIComponent(genre)}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF4D5A] hover:text-[#E50914] transition-colors"
        >
          Katalogda filter bilan ko'rish
        </Link>
      </div>
    </div>
  );
};

export default GenreDetailsPage;
