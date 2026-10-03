import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layers, ArrowLeft, Film, Play } from 'lucide-react';
import collectionService from '../../services/collectionService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import MovieCard from '../../components/movies/MovieCard';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * CollectionDetailsPage — collection description and its movies.
 */
export const CollectionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: collection, isLoading, error, refetch } = useQuery({
    queryKey: ['collection-details', id],
    queryFn: () => collectionService.getCollectionById(id),
    retry: 1,
  });

  if (isLoading) {
    return <Loader fullScreen text="Kolleksiya yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Kolleksiyani yuklab bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Layers}
          title="Kolleksiya topilmadi"
          description={`ID: #${id} kolleksiya mavjud emas.`}
          actionText="Barcha kolleksiyalar"
          onAction={() => navigate('/collections')}
        />
      </div>
    );
  }

  const movies = collection.movies || [];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative bg-[#121216] border-b border-[#27272A] pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 filter blur-3xl scale-125 pointer-events-none">
          {movies[0]?.poster && <img src={movies[0].poster} alt="" className="w-full h-full object-cover" />}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/collections')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 p-2 rounded-lg bg-[#18181F]/80 border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kolleksiyalar</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF4D5A] shrink-0">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  {collection.description}
                </p>
              )}
              <span className="inline-block px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
                {movies.length} ta film
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Movies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-[#27272A] pb-4 flex items-center gap-3">
          <Film className="w-5 h-5 text-[#E50914]" />
          Kolleksiya tarkibi
        </h2>

        {movies.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Filmlar bog'lanmagan"
            description="Bu kolleksiyaga hozircha film qo'shilmagan."
            actionText="Barcha filmlar"
            onAction={() => navigate('/movies')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((m) => (
              <MovieCard key={m.id || m._id} movie={m} />
            ))}
          </div>
        )}

        {/* Watch hint */}
        {movies.some((m) => m.id) && (
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 text-center sm:text-left">
              Ba'zi filmlar qonuniy manbalar orqali onlayn ko'rish imkoniyatiga ega bo'lishi mumkin.
            </p>
            <Link
              to={`/watch/${movies[0].id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Birinchi filmini ko'rish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
