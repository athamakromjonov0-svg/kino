import React from 'react';
import { Link } from 'react-router-dom';
import MovieCarousel from '../../components/movies/MovieCarousel';
import MovieGrid from '../../components/movies/MovieGrid';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import useMovies from '../../hooks/useMovies';
import { Sparkles, Film, Compass, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';

export const Home = () => {
  const { movies, isLoading, error, refetch } = useMovies({ genre: 'all', page: 1, limit: 8 });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {isLoading ? (
          <div className="w-full h-[450px] sm:h-[520px] rounded-3xl bg-[#18181F] animate-pulse border border-[#27272A]" />
        ) : error ? (
          <ErrorState
            title="Kinolarni yuklab bo'lmadi"
            message={error}
            onRetry={refetch}
          />
        ) : (
          <MovieCarousel movies={movies} />
        )}
      </section>

      {/* Trending / Now Showing Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4D5A] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Ommabop filmlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hozir kinoteatrlarda
            </h2>
          </div>

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors group"
          >
            <span>Barcha filmlarni ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E50914]" />
          </Link>
        </div>

        {isLoading ? (
          <MovieGridSkeleton count={8} />
        ) : error ? (
          <ErrorState
            title="Filmlar ro'yxatini yuklashda xatolik"
            message={error}
            onRetry={refetch}
          />
        ) : (
          <MovieGrid movies={movies} />
        )}
      </section>

      {/* Explore Genres Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#FF4D5A]" />
            <h3 className="text-xl font-bold text-white">Janrlar bo'yicha kashf qiling</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Action', emoji: '💥', bg: 'from-amber-500/20 to-red-500/20' },
              { name: 'Sci-Fi', emoji: '🚀', bg: 'from-blue-500/20 to-purple-500/20' },
              { name: 'Drama', emoji: '🎭', bg: 'from-purple-500/20 to-pink-500/20' },
              { name: 'Comedy', emoji: '😂', bg: 'from-yellow-500/20 to-orange-500/20' },
              { name: 'Horror', emoji: '👻', bg: 'from-red-900/30 to-black' },
              { name: 'Animation', emoji: '🎨', bg: 'from-emerald-500/20 to-teal-500/20' },
            ].map((g) => (
              <Link
                key={g.name}
                to={`/movies?genre=${g.name}`}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${g.bg} border border-[#27272A] hover:border-[#E50914]/50 transition-all hover:scale-105 group text-center`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {g.emoji}
                </span>
                <span className="text-xs font-bold text-white group-hover:text-[#FF4D5A] transition-colors">
                  {g.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why CineBook Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D5A]">
            Afzalliklarimiz
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Nega aynan CineBook?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kino tajribangizni eng yuqori darajaga olib chiqish uchun yaratilgan qulay platforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-6 space-y-3 hover:border-[#E50914]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#E50914]">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Tezkor & Oson Bron</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zal xaritasidan o'zingizga yoqqan qator va joyni bir zumda tanlang va onlayn tasdiqlang.
            </p>
          </div>

          <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-6 space-y-3 hover:border-[#E50914]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Kafolatlangan Joylar</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Har bir bron darhol backend tizimida mustahkamlanadi, qator va joyingiz to'liq kafolatlanadi.
            </p>
          </div>

          <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-6 space-y-3 hover:border-[#E50914]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Premium Kinoteatrlar</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              IMAX va Dolby Atmos standartidagi eng so'nggi zallarda premyeralardan zavqlaning.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#18181F] to-[#121216] border border-[#27272A] rounded-3xl p-8 sm:p-12 text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Qanday ishlaydi?
            </h3>
            <p className="text-xs text-zinc-400">
              3 oddiy qadamda sevimli kinongizga chipta oling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#E50914] text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-[#E50914]/30">
                1
              </div>
              <h5 className="font-bold text-sm text-white">Filmni tanlang</h5>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                Katalogdan o'zingizga ma'qul film va qulay seans vaqtini tanlang.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#E50914] text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-[#E50914]/30">
                2
              </div>
              <h5 className="font-bold text-sm text-white">Joyni band qiling</h5>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                Interaktiv zal xaritasidan qulay joylarni (4 tagacha) tanlang.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#E50914] text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-[#E50914]/30">
                3
              </div>
              <h5 className="font-bold text-sm text-white">Zavqlaning</h5>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                Broningiz shaxsiy kabinetda saqlanadi. Kinoteatrga tashrif buyuring!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
