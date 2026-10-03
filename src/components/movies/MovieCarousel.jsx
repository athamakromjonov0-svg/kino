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
      <div className="relative w-full h-[480px] rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-[#121216] border border-[#27272A] flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/30 text-[#FF4D5A] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CineBook Premium</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Kinolar olamiga xush kelibsiz
          </h1>
          <p className="text-sm text-zinc-400">
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
    <div className="relative w-full h-[450px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#27272A] shadow-2xl bg-black">
      {/* Background Banner with zoom & fade effect */}
      <div className="absolute inset-0">
        <img
          key={activeId}
          src={activeBanner}
          alt={activeMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.4] transition-all duration-700 transform scale-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#E50914]/30">
              {activeMovie.genre || "Trending"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-zinc-300 text-xs font-mono border border-white/10">
              #{activeId}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight line-clamp-2">
            {activeMovie.title}
          </h1>

          {activeMovie.description && (
            <p className="text-sm sm:text-base text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
              {activeMovie.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={Ticket}
              onClick={() => navigate(`/movies/${activeId}`)}
              className="glow-red"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-[#E50914] text-white border border-white/10 transition-all focus:outline-none z-20"
            aria-label="Oldingi film"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-[#E50914] text-white border border-white/10 transition-all focus:outline-none z-20"
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[#E50914]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
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
