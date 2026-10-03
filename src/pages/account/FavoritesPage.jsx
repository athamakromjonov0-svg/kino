import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, HardDrive } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import MovieCard from '../../components/movies/MovieCard';
import Button from '../../components/common/Button';
import { useLocalList } from '../../hooks/useLocalList';
import { LOCAL_LIST_KEYS } from '../../utils/localLists';

/**
 * FavoritesPage — device-local favorite movies.
 * Clearly labeled: saved in localStorage, NOT on the server.
 */
export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { items, clear } = useLocalList(LOCAL_LIST_KEYS.favorites);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      items.filter(
        (m) => !query || (m.title || '').toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Heart}
        title="Sevimli filmlar"
        subtitle="Yurakcha bilan belgilangan filmlaringiz"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
            {items.length} ta film
          </span>
        }
      />

      <div className="flex items-start gap-3 bg-[#101218] border border-white/[0.08] rounded-2xl p-4">
        <HardDrive className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          Bu ro'yxat <span className="text-[#F8FAFC] font-semibold">faqat shu qurilmada (localStorage)</span> saqlanadi —
          backendda server-side favorites API hozircha mavjud emas.
        </p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sevimlilar ichidan qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]/60"
            />
          </div>
          <Button variant="outline" size="md" onClick={clear}>
            Tozalash
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Sevimlilar ro'yxati bo'sh"
          description="Film sahifasida yurakcha tugmasini bosib, filmlarni shu yerga qo'shing."
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Hech narsa topilmadi"
          description="Qidiruvga mos film yo'q."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((m) => (
            <MovieCard key={m.id ?? m._id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
