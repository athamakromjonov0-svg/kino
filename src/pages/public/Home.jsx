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
          <div className="w-full h-[450px] sm:h-[560px] lg:h-[620px] rounded-2xl bg-[#171A22] shimmer border border-white/[0.08]" />
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#A78BFA] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Ommabop filmlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-[-0.02em]">
              Hozir kinoteatrlarda
            </h2>
          </div>

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#A78BFA] transition-colors group"
          >
            <span>Barcha filmlarni ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#8B5CF6]" />
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
        <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-xl font-bold text-[#F8FAFC]">Janrlar bo'yicha kashf qiling</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Action', emoji: '💥', bg: 'from-[#8B5CF6]/14 to-[#8B5CF6]/[0.04]' },
              { name: 'Sci-Fi', emoji: '🚀', bg: 'from-[#A78BFA]/14 to-[#A78BFA]/[0.04]' },
              { name: 'Drama', emoji: '🎭', bg: 'from-[#7C3AED]/14 to-[#7C3AED]/[0.04]' },
              { name: 'Comedy', emoji: '😂', bg: 'from-[#8B5CF6]/10 to-[#A78BFA]/[0.03]' },
              { name: 'Horror', emoji: '👻', bg: 'from-[#4C1D95]/20 to-[#0B0D12]' },
              { name: 'Animation', emoji: '🎨', bg: 'from-[#A78BFA]/12 to-[#8B5CF6]/[0.04]' },
            ].map((g) => (
              <Link
                key={g.name}
                to={`/movies?genre=${g.name}`}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${g.bg} border border-white/[0.08] hover:border-[#8B5CF6]/45 transition-all duration-300 ease-premium hover:scale-[1.04] hover:shadow-[0_14px_36px_-16px_rgba(139,92,246,0.5)] group text-center`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {g.emoji}
                </span>
                <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">
                  {g.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cineora Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A78BFA]">
            Afzalliklarimiz
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-[-0.02em]">
            Nega aynan Cineora?
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Kino tajribangizni eng yuqori darajaga olib chiqish uchun yaratilgan qulay platforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-[#8B5CF6]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_-18px_rgba(139,92,246,0.45)] transition-all duration-300 ease-premium">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC]">Tezkor & Oson Bron</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Zal xaritasidan o'zingizga yoqqan qator va joyni bir zumda tanlang va onlayn tasdiqlang.
            </p>
          </div>

          <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-[#8B5CF6]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_-18px_rgba(139,92,246,0.45)] transition-all duration-300 ease-premium">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#A78BFA]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC]">Kafolatlangan Joylar</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Har bir bron darhol backend tizimida mustahkamlanadi, qator va joyingiz to'liq kafolatlanadi.
            </p>
          </div>

          <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-[#8B5CF6]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_-18px_rgba(139,92,246,0.45)] transition-all duration-300 ease-premium">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#A78BFA]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC]">Premium Kinoteatrlar</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              IMAX va Dolby Atmos standartidagi eng so'nggi zallarda premyeralardan zavqlaning.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#171A22] to-[#101218] border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              Qanday ishlaydi?
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              3 oddiy qadamda sevimli kinongizga chipta oling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] font-extrabold text-base flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(139,92,246,0.8)]">
                1
              </div>
              <h5 className="font-bold text-sm text-[#F8FAFC]">Filmni tanlang</h5>
              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-xs">
                Katalogdan o'zingizga ma'qul film va qulay seans vaqtini tanlang.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] font-extrabold text-base flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(139,92,246,0.8)]">
                2
              </div>
              <h5 className="font-bold text-sm text-[#F8FAFC]">Joyni band qiling</h5>
              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-xs">
                Interaktiv zal xaritasidan qulay joylarni (4 tagacha) tanlang.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] font-extrabold text-base flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(139,92,246,0.8)]">
                3
              </div>
              <h5 className="font-bold text-sm text-[#F8FAFC]">Zavqlaning</h5>
              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-xs">
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
