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
        <div className="relative flex items-center border-b border-[#27272A] pb-4">
          <Search className="w-5 h-5 text-zinc-400 absolute left-2 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Film nomi yoki janri bo'yicha qidiring..."
            className="w-full bg-transparent pl-10 pr-10 text-white placeholder-zinc-500 text-base outline-none font-medium"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-[#27272A] rounded border border-zinc-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2 py-2">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Qidirish uchun istalgan film nomini yozing...
            </div>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
              const id = movie.id || movie._id;
              return (
                <div
                  key={id}
                  onClick={() => handleSelectMovie(id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#121216] hover:bg-[#27272A] border border-[#27272A] hover:border-[#E50914]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Film className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-[#FF4D5A] transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {movie.genre || "Janr ko'rsatilmagan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors">
                    <span className="text-xs font-medium hidden sm:inline">Ko'rish</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-zinc-400 text-xs">
              "{searchTerm}" bo'yicha hech qanday film topilmadi.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MovieSearch;
