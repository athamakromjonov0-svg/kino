import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, HardDrive, Film } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import MovieCard from '../../components/movies/MovieCard';
import Button from '../../components/common/Button';
import { useLocalList } from '../../hooks/useLocalList';
import { LOCAL_LIST_KEYS } from '../../utils/localLists';

/**
 * RecentlyViewedPage — device-local viewing history of movie pages.
 */
export const RecentlyViewedPage = () => {
  const navigate = useNavigate();
  const { items, clear } = useLocalList(LOCAL_LIST_KEYS.recentlyViewed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Clock}
        title="Yaqinda ko'rilgan"
        subtitle="Oxirgi ochgan film sahifalaringiz"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
            {items.length} ta film
          </span>
        }
      />

      <div className="flex items-start gap-3 bg-[#121216] border border-[#27272A] rounded-2xl p-4">
        <HardDrive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Tarix <span className="text-white font-semibold">faqat shu qurilmada (localStorage)</span> saqlanadi
          va hech qanday serverga yuborilmaydi.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Tarix bo'sh"
          description="Film sahifalarini ochsangiz, ular avtomatik shu yerda saqlanadi."
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="md" onClick={clear}>
              Tarixni tozalash
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((m) => (
              <MovieCard key={m.id ?? m._id} movie={m} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentlyViewedPage;
