import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../../components/movies/MovieGrid';
import MovieFilters from '../../components/movies/MovieFilters';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import useMovies from '../../hooks/useMovies';
import { ChevronLeft, ChevronRight, Search, Film, SlidersHorizontal } from 'lucide-react';

export const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'all';
  const initialPage = Number(searchParams.get('page')) || 1;

  const {
    movies,
    genre,
    page,
    totalPages,
    total,
    isLoading,
    error,
    changeGenre,
    changePage,
    refetch,
  } = useMovies({ genre: initialGenre, page: initialPage, limit: 8 });

  const [localSearch, setLocalSearch] = useState('');

  // Handle genre filter selection and sync URL query
  const handleSelectGenre = (selectedGenre) => {
    changeGenre(selectedGenre);
    const newParams = new URLSearchParams(searchParams);
    if (selectedGenre && selectedGenre !== 'all') {
      newParams.set('genre', selectedGenre);
    } else {
      newParams.delete('genre');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle page switch and sync URL query
  const handleSelectPage = (newPage) => {
    changePage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };

  // Safe client-side search across current movies
  const displayedMovies = useMemo(() => {
    if (!localSearch.trim()) return movies;
    const term = localSearch.toLowerCase();
    return movies.filter((m) => {
      const title = (m.title || m.name || '').toLowerCase();
      const g = (m.genre || '').toLowerCase();
      return title.includes(term) || g.includes(term);
    });
  }, [movies, localSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Film className="w-8 h-8 text-[#E50914]" />
            <span>Kino Katalogi</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Barcha namoyishdagi filmlar va yangiliklar (Jami: {total} ta film)
          </p>
        </div>

        {/* Local Search within current view */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filmlar ichidan qidirish..."
            className="w-full bg-[#18181F] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#27272A] focus:border-[#E50914] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Genre Filters Bar */}
      <div className="bg-[#121216] border border-[#27272A] p-3 rounded-2xl">
        <MovieFilters
          activeGenre={genre}
          onSelectGenre={handleSelectGenre}
        />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <MovieGridSkeleton count={8} />
      ) : error ? (
        <ErrorState
          title="Filmlarni yuklashda xatolik yuz berdi"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-8">
          <MovieGrid
            movies={displayedMovies}
            emptyTitle={localSearch ? "Qidiruv bo'yicha film topilmadi" : "Ushbu janrda filmlar mavjud emas"}
            emptyDescription={
              localSearch
                ? `"${localSearch}" bo'yicha hech narsa topilmadi. Qidiruv so'zini o'zgartirib ko'ring.`
                : "Boshqa janrni tanlab ko'ring yoki keyinroq qayta kiring."
            }
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#27272A]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handleSelectPage(page - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Oldingi</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => handleSelectPage(pNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      pNum === page
                        ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30 scale-105'
                        : 'bg-[#18181F] text-zinc-400 border border-[#27272A] hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => handleSelectPage(page + 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
