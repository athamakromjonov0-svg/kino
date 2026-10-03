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
      <div className="relative bg-[#121216] border-b border-[#27272A] overflow-hidden pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/actors')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 p-2 rounded-lg bg-[#18181F]/80 border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Aktyorlar ro'yxati</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl bg-zinc-900 shrink-0">
              <img
                src={actor.image || actor.photo || FALLBACK_PORTRAIT}
                alt={actor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider font-bold">
                <Clapperboard className="w-3.5 h-3.5 text-[#FF4D5A]" />
                <span>{actor.knownFor ? `Tanilgan: ${actor.knownFor}` : 'Aktyor'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {actor.name}
              </h1>
              {actor.biography ? (
                <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  {actor.biography}
                </p>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  Biografiya ma'lumoti backendda hozircha mavjud emas.
                </p>
              )}
              <div className="pt-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
                  Filmografiya: {filmography.length} ta film
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filmography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-[#27272A] pb-4 flex items-center gap-3">
          <Film className="w-5 h-5 text-[#E50914]" />
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
