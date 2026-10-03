import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Ticket, Info, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80";

export const MovieCarousel = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const heroMovies = movies.slice(0, 5);

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (!heroMovies || heroMovies.length === 0) {
    return (
      <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B0D12] to-[#101218] border border-white/[0.08] flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cineora Premium</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
            Kinolar olamiga xush kelibsiz
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Eng so'nggi premyerlar va eng qulay joylarni online band qiling.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/movies')}>
            Barcha filmlarni ko'rish
          </Button>
        </div>
      </div>
    );
  }

  const activeMovie = heroMovies[currentIndex] || heroMovies[0];
  const activeId = activeMovie.id || activeMovie._id;
  const activeBanner = activeMovie.banner || activeMovie.poster || DEFAULT_BANNER;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[560px] lg:h-[620px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.9)] bg-[#08090D]">
      {/* Background Banner with zoom & fade effect */}
      <div className="absolute inset-0">
        <img
          key={activeId}
          src={activeBanner}
          alt={activeMovie.title}
          className="w-full h-full object-cover object-center brightness-[0.45] saturate-[0.9] transition-all duration-1000 ease-premium transform scale-105"
        />
        {/* Gradients: bottom for text legibility, left for content, top for navbar blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/65 to-[#08090D]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090D]/50 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] text-[11px] font-bold tracking-[0.12em] uppercase shadow-[0_4px_14px_-4px_rgba(139,92,246,0.9)]">
              {activeMovie.genre || "Trending"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md text-[#D1D5DB] text-[11px] font-mono border border-white/[0.1]">
              #{activeId}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F8FAFC] tracking-[-0.03em] leading-[1.05] line-clamp-2">
            {activeMovie.title}
          </h1>

          {activeMovie.description && (
            <p className="text-sm sm:text-base text-[#D1D5DB] line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
              {activeMovie.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
            <Button
              variant="primary"
              size="lg"
              icon={Ticket}
              onClick={() => navigate(`/movies/${activeId}`)}
            >
              Chipta olish
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={Info}
              onClick={() => navigate(`/movies/${activeId}`)}
            >
              Film haqida batafsil
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroMovies.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md hover:bg-[#8B5CF6] text-[#F8FAFC] border border-white/[0.12] transition-all duration-200 ease-premium hover:scale-105 focus:outline-none z-20"
            aria-label="Oldingi film"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md hover:bg-[#8B5CF6] text-[#F8FAFC] border border-white/[0.12] transition-all duration-200 ease-premium hover:scale-105 focus:outline-none z-20"
            aria-label="Keyingi film"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroMovies.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-20">
          {heroMovies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ease-premium ${
                idx === currentIndex
                  ? 'w-9 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] shadow-[0_0_10px_rgba(139,92,246,0.8)]'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCarousel;
