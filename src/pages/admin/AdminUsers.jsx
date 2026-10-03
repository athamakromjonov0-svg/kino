import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ChevronLeft, ChevronRight, ShieldCheck, User } from 'lucide-react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * AdminUsers — user list from GET /users (admin role required).
 * Passwords are NEVER exposed; only id, name, email, role.
 */
export const AdminUsers = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminService.getUsers({ page, limit: 10 }),
    retry: 1,
  });

  const users = data?.items || [];

  if (isLoading) {
    return <Loader fullScreen text="Foydalanuvchilar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState
          title="Foydalanuvchilarni yuklab bo'lmadi"
          message={
            error.response?.status === 404
              ? 'GET /users endpointi backendda mavjud emas (backend kengaytmasi kerak).'
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
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Foydalanuvchilar</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Jami: {data?.total ?? 0} ta hisob</p>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Foydalanuvchilar topilmadi"
          actionText="Yangilash"
          onAction={() => refetch()}
        />
      ) : (
        <>
          <div className="bg-[#101218] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#171A22]/60">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">ID</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Ism</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Email</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/[0.08]/60 last:border-0 hover:bg-[#171A22]/40 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-[#9CA3AF]">#{u.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[#F8FAFC] text-xs font-bold uppercase shrink-0">
                            {(u.name || u.email || 'U').charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-[#F8FAFC]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#D1D5DB]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-[#F59E0B]/[0.12] border border-[#F59E0B]/[0.3] text-[#FBBF24]'
                              : 'bg-white/[0.06] border border-white/[0.14]/30 text-[#D1D5DB]'
                          }`}
                        >
                          {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171A22] border border-white/[0.08] text-xs text-[#D1D5DB] disabled:opacity-40 hover:text-[#F8FAFC]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Oldingi
                </button>
                <span className="text-xs text-[#9CA3AF]">{page} / {data.totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page >= data.totalPages}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171A22] border border-white/[0.08] text-xs text-[#D1D5DB] disabled:opacity-40 hover:text-[#F8FAFC]"
                >
                  Keyingi
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#6B7280]">
            Parollar hech qachon ko'rsatilmaydi. Rollarni o'zgartirish uchun backendda
            PUT /users/:id/role endpointi kerak (README'da hujjatlashtirilgan).
          </p>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
