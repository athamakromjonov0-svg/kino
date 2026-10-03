import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Info, Ticket, CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import bookingService from '../../services/bookingService';
import { formatDateTime } from '../../utils/formatDate';

/**
 * NotificationsPage — the backend has no dedicated notifications endpoint,
 * so instead of faking data this page derives REAL activity notifications
 * from the user's actual bookings (confirmed / cancelled).
 */
export const NotificationsPage = () => {
  const navigate = useNavigate();

  const { bookings, isLoading } = useBookingsSnapshot();

  const notifications = useMemo(() => {
    return (bookings || [])
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((b) => ({
        id: b.id,
        type: b.status === 'Bekor qilingan' ? 'cancelled' : 'confirmed',
        title: b.status === 'Bekor qilingan' ? 'Bron bekor qilindi' : 'Bron tasdiqlandi',
        message: `Bron #${b.id} — seans #${b.sessionId}, qator ${b.row}, joy ${b.seat}`,
        date: b.createdAt,
      }));
  }, [bookings]);

  if (isLoading) {
    return <Loader fullScreen text="Bildirishnomalar yuklanmoqda..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Bell}
        title="Bildirishnomalar"
        subtitle="Bronlar va akkaunt faoliyati"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
            {notifications.length} ta
          </span>
        }
      />

      <div className="flex items-start gap-3 bg-[#101218] border border-white/[0.08] rounded-2xl p-4">
        <Info className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          Hozircha bildirishnomalar <span className="text-[#F8FAFC] font-semibold">faqat bronlar tarixidan</span> hosil qilinadi.
          Push/email bildirishnomalar uchun alohida notifications API kerak — u backend kengaytmasi sifatida README'da hujjatlashtirilgan.
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Bildirishnomalar yo'q"
          description="Bron qilingan chiptalar bo'yicha bildirishnomalar shu yerda paydo bo'ladi."
          actionText="Seanslarni ko'rish"
          onAction={() => navigate('/sessions')}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'confirmed'
                    ? 'bg-[#22C55E]/[0.14] border border-[#22C55E]/[0.28] text-[#34D399]'
                    : 'bg-red-500/15 border border-red-500/30 text-[#A78BFA]'
                }`}
              >
                {n.type === 'confirmed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#F8FAFC]">{n.title}</p>
                  {n.date && (
                    <span className="text-[11px] text-[#6B7280] shrink-0">{formatDateTime(n.date)}</span>
                  )}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">{n.message}</p>
              </div>
              <Ticket className="w-4 h-4 text-[#6B7280] shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Small local hook to avoid circular deps with useBookings + toast */
function useBookingsSnapshot() {
  const [bookings, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    bookingService
      .getMyBookings()
      .then((data) => {
        if (mounted) setBookings(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setBookings([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { bookings, isLoading };
}

export default NotificationsPage;
