import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PenLine, Star, Send, ArrowLeft } from 'lucide-react';
import movieService from '../../services/movieService';
import reviewService from '../../services/reviewService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * WriteReviewPage — submit a review for a movie.
 * Only works if the backend reviews API (POST /reviews) is available;
 * server errors are shown honestly.
 */
export const WriteReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(8);
  const [serverError, setServerError] = useState(null);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['review-movie', id],
    queryFn: () => movieService.getMovieById(id),
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { text: '' },
  });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      await reviewService.createReview({
        movieId: id,
        text: values.text,
        rating,
      });
      toast.success('Sharhingiz muvaffaqiyatli yuborildi!');
      navigate(`/movies/${id}`);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (err.response?.status === 401) {
        toast.error('Sharh yozish uchun tizimga kirish talab qilinadi');
        navigate('/login', { state: { from: { pathname: `/movies/${id}/review` } } });
        return;
      }
      setServerError(msg);
      toast.error(msg);
    }
  };

  if (isLoading) {
    return <Loader fullScreen text="Film ma'lumotlari yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Filmni yuklab bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={() => navigate(0)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <button
        type="button"
        onClick={() => navigate(`/movies/${id}`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Film sahifasiga qaytish</span>
      </button>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4D5A]">
          <PenLine className="w-4 h-4" />
          <span>Sharh yozish</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {movie?.title || `Film #${id}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Rating */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Reyting (1–10)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const value = i + 1;
              const active = rating >= value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                      : 'bg-[#18181F] border border-[#27272A] text-zinc-400 hover:text-white'
                  }`}
                  aria-label={`${value} ball`}
                >
                  {value}
                </button>
              );
            })}
            <span className="ml-2 inline-flex items-center gap-1 text-sm font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              {rating}
            </span>
          </div>
        </div>

        {/* Review text */}
        <div className="space-y-2">
          <label htmlFor="review-text" className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Sharh matni
          </label>
          <textarea
            id="review-text"
            rows={6}
            placeholder="Film haqidagi fikringizni yozing (kamida 10 belgi)..."
            className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]/60 resize-none"
            {...register('text', {
              required: 'Sharh matni bo\'sh bo\'lmasligi kerak',
              minLength: { value: 10, message: 'Kamida 10 belgi yozing' },
              maxLength: { value: 2000, message: 'Ko\'pi bilan 2000 belgi' },
            })}
          />
          {errors.text && (
            <p className="text-xs text-red-400">{errors.text.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 text-xs text-red-300">
            {serverError}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#c40811] disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-[#E50914]/30 transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>
          <Link
            to={`/movies/${id}`}
            className="px-6 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Bekor qilish
          </Link>
        </div>
      </form>
    </div>
  );
};

export default WriteReviewPage;
