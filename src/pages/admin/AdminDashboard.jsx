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
  backgroundColor: '#18181F',
  border: '1px solid #27272A',
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
    { label: 'Jami filmlar', value: data.totalMovies, icon: Film, color: 'text-[#FF4D5A]', bg: 'bg-[#E50914]/15 border-[#E50914]/30' },
    { label: 'Jami foydalanuvchilar', value: data.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
    { label: 'Jami bronlar', value: data.totalBookings, icon: Ticket, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
    { label: 'Faol seanslar', value: data.activeSessions, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">Platforma umumiy ko'rsatkichlari</p>
        </div>
      </div>

      {/* Demo preview banner */}
      {data.isDemoPreview && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
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
            className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-3 hover:border-[#E50914]/40 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mt-1">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings over time */}
        <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF4D5A]" />
            Bronlar dinamikasi
          </h2>
          {data.bookingsOverTime.length === 0 ? (
            <p className="text-xs text-zinc-500 py-8 text-center">Ma'lumot yo'q</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.bookingsOverTime}>
                  <defs>
                    <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E50914" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#E50914" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="count" stroke="#E50914" strokeWidth={2} fill="url(#bookingGradient)" name="Bronlar" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Popular movies */}
        <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF4D5A]" />
            Ommabop filmlar (bronlar soni)
          </h2>
          {data.popularMovies.length === 0 ? (
            <p className="text-xs text-zinc-500 py-8 text-center">Ma'lumot yo'q</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popularMovies} layout="vertical">
                  <CartesianGrid stroke="#27272A" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#71717A', fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="title" tick={{ fill: '#A1A1AA', fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="bookings" fill="#E50914" radius={[0, 6, 6, 0]} name="Bronlar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* User growth */}
      {data.userGrowth.length > 0 && (
        <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#FF4D5A]" />
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
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
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
