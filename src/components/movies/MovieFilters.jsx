import React from 'react';
import { Layers } from 'lucide-react';

const POPULAR_GENRES = [
  { id: 'all', label: 'Barchasi' },
  { id: 'Action', label: 'Action' },
  { id: 'Sci-Fi', label: 'Sci-Fi' },
  { id: 'Drama', label: 'Drama' },
  { id: 'Comedy', label: 'Comedy' },
  { id: 'Thriller', label: 'Thriller' },
  { id: 'Horror', label: 'Horror' },
  { id: 'Animation', label: 'Animation' },
];

export const MovieFilters = ({
  activeGenre = 'all',
  onSelectGenre,
  availableGenres = [],
}) => {
  // If availableGenres is provided by backend data, merge them
  const genresToDisplay = availableGenres.length > 0
    ? [{ id: 'all', label: 'Barchasi' }, ...availableGenres.map(g => ({ id: g, label: g }))]
    : POPULAR_GENRES;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] mr-2 flex-shrink-0">
        <Layers className="w-4 h-4 text-[#A78BFA]" />
        <span>Janrlar:</span>
      </div>

      <div className="flex items-center gap-2 flex-nowrap">
        {genresToDisplay.map((g) => {
          const isActive = (activeGenre || 'all').toLowerCase() === g.id.toLowerCase();
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelectGenre(g.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-[#8B5CF6] text-[#F8FAFC] border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/25 scale-105'
                  : 'bg-[#171A22] text-[#9CA3AF] border-white/[0.08] hover:border-white/[0.14] hover:text-[#F8FAFC]'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MovieFilters;
