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
          <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
            {items.length} ta film
          </span>
        }
      />

      <div className="flex items-start gap-3 bg-[#101218] border border-white/[0.08] rounded-2xl p-4">
        <HardDrive className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          Tarix <span className="text-[#F8FAFC] font-semibold">faqat shu qurilmada (localStorage)</span> saqlanadi
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
