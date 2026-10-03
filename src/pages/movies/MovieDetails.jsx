import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import movieService from '../../services/movieService';
import SessionCard from '../../components/booking/SessionCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getErrorMessage } from '../../utils/errorHandler';
import { Film, Calendar, Clock, ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const RECENT_KEY = 'cinebook_recent_movies';
const FAVORITES_KEY = 'cinebook_favorites';
const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    setError(null);
    setIs404(false);

    try {
      const data = await movieService.getMovieById(id);
      if (!data) {
        setIs404(true);
        return;
      }
      setMovie(data);

      // Save to recently viewed in localStorage
      try {
        const savedRecent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        const filtered = savedRecent.filter((m) => (m.id || m._id) !== data.id);
        filtered.unshift({
          id: data.id,
          title: data.title,
          poster: data.poster,
          genre: data.genre,
        });
        localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 10)));
      } catch {}

      // Check favorite status
      try {
        const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        setIsFavorite(favs.some((f) => (f.id || f._id) === data.id));
      } catch {}

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setIs404(true);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (!movie) return;
    try {
      const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      const exists = favs.some((f) => (f.id || f._id) === movie.id);
      let updated;
      if (exists) {
        updated = favs.filter((f) => (f.id || f._id) !== movie.id);
        setIsFavorite(false);
        toast.success("Sevimlilardan olib tashlandi");
      } else {
        updated = [...favs, movie];
        setIsFavorite(true);
        toast.success("Sevimlilarga qo'shildi!");
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Havola nusxalandi!");
  };

  if (isLoading) {
    return <Loader fullScreen text="Film ma'lumotlari yuklanmoqda..." />;
  }

  if (is404) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <EmptyState
          icon={Film}
          title="Film topilmadi (404)"
          description={`ID: #${id} bo'lgan film mavjud emas yoki o'chirilgan bo'lishi mumkin.`}
          actionText="Barcha filmlarga qaytish"
          onAction={() => navigate('/movies')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Film ma'lumotlarini yuklab bo'lmadi"
          message={error}
          onRetry={fetchMovieDetails}
        />
      </div>
    );
  }

  const sessions = movie?.sessions || [];
  const poster = movie?.poster || FALLBACK_POSTER;

  return (
    <div className="pb-24 space-y-12">
      {/* Hero Header with Background Backdrop */}
      <div className="relative w-full bg-[#121216] border-b border-[#27272A] overflow-hidden pt-8 pb-12">
        {/* Blurred ambient backdrop */}
        <div className="absolute inset-0 opacity-20 filter blur-3xl scale-125 pointer-events-none">
          <img src={poster} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 p-2 rounded-lg bg-[#18181F]/80 border border-[#27272A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ortga qaytish</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Card */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl bg-zinc-900">
                <img
                  src={poster}
                  alt={movie?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-zinc-300">
                    ID #{movie?.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="md:col-span-8 lg:col-span-9 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                {movie?.genre && (
                  <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E50914]/20">
                    {movie.genre}
                  </span>
                )}
                <span className="text-xs text-zinc-400 font-medium">Kinoteatr Premyerasi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {movie?.title}
              </h1>

              {movie?.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Tavsif
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* Action buttons (Favorite & Share) */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isFavorite
                      ? 'bg-red-950/40 border-red-500/50 text-[#FF4D5A]'
                      : 'bg-[#18181F] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF4D5A]' : ''}`} />
                  <span>{isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-600 text-xs font-semibold transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Ulashish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Sessions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-[#E50914]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Mavjud Seanslar
              </h2>
              <p className="text-xs text-zinc-400">
                Seans vaqtini tanlang va chiptalarni bron qiling
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-zinc-400 bg-[#18181F] px-3 py-1.5 rounded-xl border border-[#27272A]">
            {sessions.length} ta seans
          </span>
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Hozircha seanslar mavjud emas"
            description="Ushbu film uchun seanslar tez kunda e'lon qilinadi. Boshqa filmlarni ko'rishingiz mumkin."
            actionText="Boshqa filmlarni ko'rish"
            onAction={() => navigate('/movies')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session, index) => (
              <SessionCard
                key={session.id || session._id || index}
                session={session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
