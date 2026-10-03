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
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Bronlar</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Barcha foydalanuvchilar bronlari: {data?.total ?? 0} ta</p>
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
        <div className="bg-[#101218] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#171A22]/60">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Bron</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Foydalanuvchi</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Seans</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Joy</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Sana</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Holat</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/[0.08]/60 last:border-0 hover:bg-[#171A22]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-bold text-[#F8FAFC]">#{b.id}</td>
                    <td className="px-4 py-3 text-xs text-[#D1D5DB]">{b.userEmail || `User #${b.userId}`}</td>
                    <td className="px-4 py-3 text-xs text-[#D1D5DB]">#{b.sessionId}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] font-bold">
                        R{b.row} • J{b.seat}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">
                      {b.createdAt ? formatDateTime(b.createdAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          b.status === 'Bekor qilingan'
                            ? 'bg-white/[0.06] border border-white/[0.14]/30 text-[#D1D5DB]'
                            : 'bg-[#22C55E]/[0.14] border border-[#22C55E]/[0.28] text-[#34D399]'
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
