import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDateTime } from '../../utils/formatDate';

/**
 * AdminBookings — read-only overview of ALL bookings
 * (backend extension GET /bookings, admin role required).
 */
export const AdminBookings = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: adminService.getAllBookings,
    retry: 1,
  });

  const bookings = data?.items || [];

  if (isLoading) {
    return <Loader fullScreen text="Bronlar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState
          title="Bronlarni yuklab bo'lmadi"
          message={
            error.response?.status === 404
              ? 'GET /bookings (barcha bronlar) endpointi backendda mavjud emas.'
              : getErrorMessage(error)
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Bronlar</h1>
        <p className="text-xs text-zinc-400 mt-1">Barcha foydalanuvchilar bronlari: {data?.total ?? 0} ta</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="Bronlar yo'q"
          description="Hozircha hech kim bron qilmagan."
          actionText="Yangilash"
          onAction={() => refetch()}
        />
      ) : (
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#18181F]/60">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Bron</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Foydalanuvchi</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Seans</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Joy</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Sana</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Holat</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#27272A]/60 last:border-0 hover:bg-[#18181F]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-bold text-white">#{b.id}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300">{b.userEmail || `User #${b.userId}`}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300">#{b.sessionId}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4D5A] font-bold">
                        R{b.row} • J{b.seat}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {b.createdAt ? formatDateTime(b.createdAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          b.status === 'Bekor qilingan'
                            ? 'bg-zinc-500/15 border border-zinc-500/30 text-zinc-300'
                            : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {b.status || 'Tasdiqlangan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
