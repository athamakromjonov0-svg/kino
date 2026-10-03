import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, Film, Clock, HardDrive, Play, Trash2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { useDiscoveryStore } from '../../store/useDiscoveryStore';
import { formatDateTime } from '../../utils/formatDate';

const formatClock = (s) => {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

/**
 * ContinueWatchingPage — shows ONLY entries where the user actually has
 * saved playback progress from watching a lawful source.
 * Progress is device-local (localStorage), clearly labeled.
 */
export const ContinueWatchingPage = () => {
  const navigate = useNavigate();
  const playbackProgress = useDiscoveryStore((s) => s.playbackProgress);
  const clearPlaybackProgress = useDiscoveryStore((s) => s.clearPlaybackProgress);

  const entries = Object.entries(playbackProgress || {})
    .map(([movieId, data]) => ({ movieId, ...data }))
    .filter((e) => e.progress > 5)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={History}
        title="Davom ettirish"
        subtitle="To'liq ko'rilmay qolgan filmlar"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
            {entries.length} ta yozuv
          </span>
        }
      />

      <div className="flex items-start gap-3 bg-[#121216] border border-[#27272A] rounded-2xl p-4">
        <HardDrive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Ijro holati <span className="text-white font-semibold">faqat shu qurilmada (localStorage)</span> saqlanadi.
          Bu yerda faqat haqiqatan boshlangan va qonuniy manba orqali ko'rilgan filmlar paydo bo'ladi.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="Hozircha hech narsa boshlanmagan"
          description="Filmlarni Watch sahifasida tomosha qilishni boshlang — ijro holati avtomatik saqlanadi."
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const pct = e.duration ? Math.min(100, Math.round((e.progress / e.duration) * 100)) : 0;
            return (
              <div
                key={e.movieId}
                className="bg-[#18181F] border border-[#27272A] hover:border-[#E50914]/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5 text-[#FF4D5A]" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-white truncate">
                      Film #{e.movieId}
                    </h3>
                    <span className="text-xs text-zinc-500 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatClock(e.progress)}
                      {e.duration ? ` / ${formatClock(e.duration)}` : ''}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#27272A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E50914] to-[#FF4D5A] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {e.updatedAt ? `${formatDateTime(new Date(e.updatedAt).toISOString())} da ko'rilgan` : ''}
                    {pct > 0 ? ` — ${pct}% tugallangan` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/watch/${e.movieId}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Davom ettirish
                  </Link>
                  <button
                    type="button"
                    onClick={() => clearPlaybackProgress(e.movieId)}
                    className="p-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                    aria-label="Yozuvni o'chirish"
                    title="Yozuvni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContinueWatchingPage;
