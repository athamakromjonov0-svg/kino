import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, HardDrive, Film } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import MovieCard from '../../components/movies/MovieCard';
import Button from '../../components/common/Button';
import { useLocalList } from '../../hooks/useLocalList';
import { LOCAL_LIST_KEYS } from '../../utils/localLists';
import { KNOWN_GENRES } from '../../constants';

/**
 * WatchlistPage — device-local "watch later" list.
 * Clearly labeled: saved in localStorage, NOT on the server
 * (backend has no watchlist endpoints yet).
 */
export const WatchlistPage = () => {
  const navigate = useNavigate();
  const { items, remove, clear } = useLocalList(LOCAL_LIST_KEYS.watchlist);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');

  const genresInList = useMemo(() => {
    const set = new Set(items.map((m) => m.genre).filter(Boolean));
    return [...set];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const matchesQuery = !query || (m.title || '').toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genre === 'all' || m.genre === genre;
      return matchesQuery && matchesGenre;
    });
  }, [items, query, genre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Bookmark}
        title="Watchlist"
        subtitle="Keyinroq ko'rish uchun saqlangan filmlar"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
            {items.length} ta film
          </span>
        }
      />

      {/* Device-local transparency notice */}
      <div className="flex items-start gap-3 bg-[#121216] border border-[#27272A] rounded-2xl p-4">
        <HardDrive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Bu ro'yxat <span className="text-white font-semibold">faqat shu qurilmada (localStorage)</span> saqlanadi —
          backendda hozircha server-side watchlist API mavjud emas, shuning uchun boshqa qurilmada ko'rinmaydi.
        </p>
      </div>

      {/* Search + filter */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Watchlist ichidan qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]/60"
            />
          </div>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
          >
            <option value="all">Barcha janrlar</option>
            {genresInList.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <Button variant="outline" size="md" onClick={clear}>
            Tozalash
          </Button>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Watchlist bo'sh"
          description="Film sahifasidan «Keyinroq ko'rish» tugmasi orqali filmlarni qo'shing."
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Hech narsa topilmadi"
          description="Qidiruv yoki filtrga mos film yo'q."
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

export default WatchlistPage;
