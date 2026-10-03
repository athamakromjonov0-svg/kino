import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Film, Users, Ticket, Clock, AlertTriangle, TrendingUp, Activity, UserPlus,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage } from '../../utils/errorHandler';

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#171A22',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#fff',
};

/**
 * AdminDashboard — real stats from GET /admin/stats (admin role required).
 * When backend marks the payload isDemoPreview, the dashboard shows an
 * explicit demo banner instead of presenting the numbers as production data.
 */
export const AdminDashboard = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
    retry: 1,
  });

  if (isLoading) {
    return <Loader fullScreen text="Statistika yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState
          title="Statistikani yuklab bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const stats = [
    { label: 'Jami filmlar', value: data.totalMovies, icon: Film, color: 'text-[#A78BFA]', bg: 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30' },
    { label: 'Jami foydalanuvchilar', value: data.totalUsers, icon: Users, color: 'text-[#60A5FA]', bg: 'bg-[#3B82F6]/[0.14] border-[#3B82F6]/[0.28]' },
    { label: 'Jami bronlar', value: data.totalBookings, icon: Ticket, color: 'text-[#34D399]', bg: 'bg-[#22C55E]/[0.14] border-[#22C55E]/[0.28]' },
    { label: 'Faol seanslar', value: data.activeSessions, icon: Clock, color: 'text-[#FBBF24]', bg: 'bg-[#F59E0B]/[0.12] border-[#F59E0B]/[0.3]' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Dashboard</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">Platforma umumiy ko'rsatkichlari</p>
        </div>
      </div>

      {/* Demo preview banner */}
      {data.isDemoPreview && (
        <div className="flex items-start gap-3 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/[0.3] rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
          <p className="text-xs text-[#FDE68A]/90 leading-relaxed">
            <span className="font-bold">Demo preview rejimi.</span> Haqiqiy backend statistika
            endpointlari hozircha mavjud emas — quyidagi raqamlar namunaviy ma'lumotlar asosida
            hisoblangan va real vaqt ko'rsatkichi emas.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-3 hover:border-[#8B5CF6]/40 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">{s.value}</p>
              <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-[0.08em] mt-1">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings over time */}
        <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
            Bronlar dinamikasi
          </h2>
          {data.bookingsOverTime.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-8 text-center">Ma'lumot yo'q</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.bookingsOverTime}>
                  <defs>
                    <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} fill="url(#bookingGradient)" name="Bronlar" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Popular movies */}
        <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#A78BFA]" />
            Ommabop filmlar (bronlar soni)
          </h2>
          {data.popularMovies.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-8 text-center">Ma'lumot yo'q</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popularMovies} layout="vertical">
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="title" tick={{ fill: '#A1A1AA', fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="bookings" fill="#8B5CF6" radius={[0, 6, 6, 0]} name="Bronlar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* User growth */}
      {data.userGrowth.length > 0 && (
        <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#A78BFA]" />
            Foydalanuvchilar o'sishi
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#71717A', fontSize: 10 }} />
                <YAxis tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="users" stroke="#22C55E" strokeWidth={2} fill="url(#userGradient)" name="Foydalanuvchilar" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
