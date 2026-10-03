import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, ArrowLeft, Clapperboard, Film } from 'lucide-react';
import actorService from '../../services/actorService';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import MovieCard from '../../components/movies/MovieCard';
import { getErrorMessage } from '../../utils/errorHandler';

const FALLBACK_PORTRAIT = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

/**
 * ActorDetailsPage — biography (if backend provides), filmography
 * and popular movies of the actor.
 */
export const ActorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: actor, isLoading, error, refetch } = useQuery({
    queryKey: ['actor-details', id],
    queryFn: () => actorService.getActorById(id),
    retry: 1,
  });

  if (isLoading) {
    return <Loader fullScreen text="Aktyor ma'lumotlari yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Aktyorni yuklab bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={User}
          title="Aktyor topilmadi"
          description={`ID: #${id} aktyor mavjud emas.`}
          actionText="Aktyorlar ro'yxati"
          onAction={() => navigate('/actors')}
        />
      </div>
    );
  }

  const filmography = actor.filmography || [];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative bg-[#101218] border-b border-white/[0.08] overflow-hidden pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/actors')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#F8FAFC] mb-6 p-2 rounded-lg bg-[#171A22]/80 border border-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Aktyorlar ro'yxati</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0B0D12] shrink-0">
              <img
                src={actor.image || actor.photo || FALLBACK_PORTRAIT}
                alt={actor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF] uppercase tracking-[0.08em] font-bold">
                <Clapperboard className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>{actor.knownFor ? `Tanilgan: ${actor.knownFor}` : 'Aktyor'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                {actor.name}
              </h1>
              {actor.biography ? (
                <p className="text-sm text-[#D1D5DB] leading-relaxed max-w-2xl">
                  {actor.biography}
                </p>
              ) : (
                <p className="text-xs text-[#6B7280] italic">
                  Biografiya ma'lumoti backendda hozircha mavjud emas.
                </p>
              )}
              <div className="pt-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
                  Filmografiya: {filmography.length} ta film
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] border-b border-white/[0.08] pb-4 flex items-center gap-3">
          <Film className="w-5 h-5 text-[#8B5CF6]" />
          Filmlarda rol o'ynagan
        </h2>

        {filmography.length === 0 ? (
          <EmptyState
            icon={Film}
            title="Filmografiya bo'sh"
            description="Bu aktyor haqida film ma'lumotlari hozircha backendda bog'lanmagan."
            actionText="Barcha filmlar"
            onAction={() => navigate('/movies')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filmography.map((m) => (
              <MovieCard key={m.id || m._id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorDetailsPage;
