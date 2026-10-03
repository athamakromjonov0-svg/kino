import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import movieService from '../../services/movieService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatDate';
import { Clock, MapPin, Film, Ticket, ArrowLeft, Users } from 'lucide-react';

export const SessionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['session-details', id],
    queryFn: () => movieService.getMovies({ page: 1, limit: 100 }),
  });

  const result = useMemo(() => {
    const movies = data?.movies || [];
    for (const m of movies) {
      const found = (m.sessions || []).find((s) => String(s.id || s._id) === String(id));
      if (found) {
        return { session: found, movie: m };
      }
    }
    return null;
  }, [data, id]);

  if (isLoading) {
    return <Loader fullScreen text="Seans ma'lumotlari yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState title="Seansni yuklab bo'lmadi" message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Clock}
          title="Seans topilmadi"
          description={`ID: #${id} bo'lgan seans mavjud emas yoki bekor qilingan.`}
          actionText="Barcha seanslar"
          onAction={() => navigate('/sessions')}
        />
      </div>
    );
  }

  const { session, movie } = result;
  const sessionId = session.id || session._id;
  const hallName = session.hall || session.room || `Zal #${session.hallId || sessionId}`;
  const sessionTime = session.time || session.date || session.startTime;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <button
        type="button"
        onClick={() => navigate('/sessions')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Seanslar ro'yxati</span>
      </button>

      {/* Session Hero */}
      <div className="bg-[#121216] border border-[#27272A] rounded-3xl overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-[#E50914]/20 via-[#121216] to-[#121216] flex items-center justify-center">
          <Clock className="w-16 h-16 text-[#E50914]/30" />
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Seans #{sessionId}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Movie info */}
          <div className="flex items-start gap-4">
            {movie?.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl border border-[#27272A]"
              />
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider font-bold">
                <Film className="w-3.5 h-3.5 text-[#FF4D5A]" />
                <span>Film</span>
              </div>
              <h2 className="text-xl font-bold text-white">{movie?.title}</h2>
              {movie?.genre && (
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#E50914]/20 border border-[#E50914]/30 text-[#FF4D5A] text-xs font-bold">
                  {movie.genre}
                </span>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#27272A]">
            <div className="bg-[#18181F] rounded-xl p-4 border border-[#27272A]">
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF4D5A]" />
                <span>Zal</span>
              </div>
              <p className="text-sm font-bold text-white">{hallName}</p>
            </div>

            <div className="bg-[#18181F] rounded-xl p-4 border border-[#27272A]">
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vaqt</span>
              </div>
              <p className="text-sm font-bold text-white">
                {sessionTime ? formatDateTime(sessionTime) : "Ko'rsatilmagan"}
              </p>
            </div>

            <div className="bg-[#18181F] rounded-xl p-4 border border-[#27272A]">
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Joylar</span>
              </div>
              <p className="text-sm font-bold text-white">Zal xaritasida mavjud</p>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate(`/booking/${sessionId}`)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-sm font-bold shadow-lg shadow-[#E50914]/30 transition-all hover:scale-[1.01]"
          >
            <Ticket className="w-5 h-5" />
            <span>Joyni tanlash va bron qilish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;
