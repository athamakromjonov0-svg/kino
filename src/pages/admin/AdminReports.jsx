import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Download, AlertTriangle, Film } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * AdminReports — booking trends and popular movies.
 * CSV export downloads exactly the data rendered (marked demo when applicable).
 */
export const AdminReports = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
    retry: 1,
  });

  const exportCsv = () => {
    if (!data) return;
    const rows = [['date', 'bookings'], ...data.bookingsOverTime.map((r) => [r.date, r.count])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cineora-bookings-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalBookings = useMemo(
    () => (data?.bookingsOverTime || []).reduce((acc, r) => acc + (Number(r.count) || 0), 0),
    [data]
  );

  if (isLoading) {
    return <Loader fullScreen text="Hisobotlar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState title="Hisobotni yuklab bo'lmadi" message={getErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Hisobotlar</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Ko'rsatilgan davrdagi jami bronlar: {totalBookings}
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!data.bookingsOverTime.length}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] hover:border-white/[0.14] text-[#F8FAFC] text-xs font-bold transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          CSV eksport
        </button>
      </div>

      {data.isDemoPreview && (
        <div className="flex items-start gap-3 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/[0.3] rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
          <p className="text-xs text-[#FDE68A]/90 leading-relaxed">
            <span className="font-bold">Demo preview.</span> Hisobot ma'lumotlari namunaviy —
            real vaqt statistikasi emas. CSV eksport aynan shu ko'rsatilgan ma'lumotlarni saqlaydi.
          </p>
        </div>
      )}

      {/* Booking trend */}
      <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#A78BFA]" />
          Kunlik bronlar
        </h2>
        {data.bookingsOverTime.length === 0 ? (
          <p className="text-xs text-[#6B7280] py-8 text-center">Ma'lumot yo'q</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bookingsOverTime}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171A22',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Bronlar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Popular movies ranking */}
      <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
          <Film className="w-4 h-4 text-[#A78BFA]" />
          Film reytingi
        </h2>
        {data.popularMovies.length === 0 ? (
          <p className="text-xs text-[#6B7280] py-8 text-center">Ma'lumot yo'q</p>
        ) : (
          <div className="space-y-3">
            {data.popularMovies.map((m, i) => {
              const max = Math.max(...data.popularMovies.map((x) => x.bookings || 0), 1);
              return (
                <div key={m.movieId || i} className="flex items-center gap-4">
                  <span className="w-6 text-xs font-bold text-[#6B7280]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <p className="text-xs font-semibold text-[#F8FAFC] truncate">{m.title}</p>
                      <span className="text-xs font-bold text-[#A78BFA] shrink-0">{m.bookings}</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                        style={{ width: `${((m.bookings || 0) / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminReports;
