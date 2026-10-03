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
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Foydalanuvchilar</h1>
        <p className="text-xs text-zinc-400 mt-1">Jami: {data?.total ?? 0} ta hisob</p>
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
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#27272A] bg-[#18181F]/60">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">ID</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ism</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Email</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#27272A]/60 last:border-0 hover:bg-[#18181F]/40 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-zinc-400">#{u.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF4D5A] flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                            {(u.name || u.email || 'U').charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                              : 'bg-zinc-500/15 border border-zinc-500/30 text-zinc-300'
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
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs text-zinc-300 disabled:opacity-40 hover:text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Oldingi
                </button>
                <span className="text-xs text-zinc-400">{page} / {data.totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page >= data.totalPages}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs text-zinc-300 disabled:opacity-40 hover:text-white"
                >
                  Keyingi
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-zinc-500">
            Parollar hech qachon ko'rsatilmaydi. Rollarni o'zgartirish uchun backendda
            PUT /users/:id/role endpointi kerak (README'da hujjatlashtirilgan).
          </p>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
