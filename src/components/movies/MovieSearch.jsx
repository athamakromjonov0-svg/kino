import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, ChevronRight } from 'lucide-react';
import Modal from '../common/Modal';

export const MovieSearch = ({ isOpen, onClose, allMovies = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Reset search term when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Filter movies in-memory safely (since backend /movies?genre supports genre, and search endpoint isn't defined)
  const filteredMovies = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allMovies.filter((movie) => {
      const title = (movie.title || movie.name || '').toLowerCase();
      const genre = (movie.genre || '').toLowerCase();
      const desc = (movie.description || '').toLowerCase();
      return title.includes(term) || genre.includes(term) || desc.includes(term);
    }).slice(0, 6);
  }, [searchTerm, allMovies]);

  const handleSelectMovie = (id) => {
    onClose();
    navigate(`/movies/${id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" showCloseButton={false}>
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/[0.08] pb-4">
          <Search className="w-5 h-5 text-[#9CA3AF] absolute left-2 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Film nomi yoki janri bo'yicha qidiring..."
            className="w-full bg-transparent pl-10 pr-10 text-[#F8FAFC] placeholder-[#6B7280] text-base outline-none font-medium"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#F8FAFC]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#9CA3AF] bg-white/[0.04] rounded border border-white/[0.1]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2 py-2">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8 text-[#6B7280] text-xs">
              Qidirish uchun istalgan film nomini yozing...
            </div>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
              const id = movie.id || movie._id;
              return (
                <div
                  key={id}
                  onClick={() => handleSelectMovie(id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#101218] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#8B5CF6]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#1D212B] flex-shrink-0">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                          <Film className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {movie.genre || "Janr ko'rsatilmagan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#6B7280] group-hover:text-[#F8FAFC] transition-colors">
                    <span className="text-xs font-medium hidden sm:inline">Ko'rish</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-[#9CA3AF] text-xs">
              "{searchTerm}" bo'yicha hech qanday film topilmadi.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MovieSearch;
