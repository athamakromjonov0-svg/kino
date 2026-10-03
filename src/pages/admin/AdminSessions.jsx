import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Clock, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';
import movieService from '../../services/movieService';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';
import { formatDateTime } from '../../utils/formatDate';

const EMPTY_FORM = { movieId: '', hall: 'Zal 1 (IMAX Laser)', time: '' };

/**
 * AdminSessions — create/edit/delete sessions via backend extension
 * endpoints POST/PUT/DELETE /sessions (admin role required server-side).
 */
export const AdminSessions = () => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState(null); // { mode, session? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: () => adminService.getAllSessions(),
    retry: 1,
  });

  const { data: moviesData } = useQuery({
    queryKey: ['admin-session-movies'],
    queryFn: () => movieService.getMovies({ page: 1, limit: 100 }),
  });
  const movies = moviesData?.movies || [];

  const sessions = data?.items || [];

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalState({ mode: 'create' });
  };

  const openEdit = (session) => {
    setForm({
      movieId: String(session.movieId || ''),
      hall: session.hall || '',
      time: session.time ? session.time.slice(0, 16) : '',
    });
    setModalState({ mode: 'edit', session });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.movieId || !form.hall.trim() || !form.time) {
      toast.error('Film, zal va vaqt majburiy');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        movieId: Number(form.movieId),
        hall: form.hall,
        time: new Date(form.time).toISOString(),
      };
      if (modalState.mode === 'create') {
        await adminService.createSession(payload);
        toast.success('Seans qo\'shildi');
      } else {
        await adminService.updateSession(modalState.session.id, payload);
        toast.success('Seans yangilandi');
      }
      setModalState(null);
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Ruxsat yo\'q: faqat admin uchun (403)');
      } else if (err.response?.status === 404) {
        toast.error('Backendda sessions CRUD endpointlari mavjud emas (404)');
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await adminService.deleteSession(deleteTarget.id);
      toast.success('Seans o\'chirildi');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Ruxsat yo\'q: faqat admin uchun (403)');
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen text="Seanslar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState
          title="Seanslarni yuklab bo'lmadi"
          message={
            error.response?.status === 404
              ? 'GET /sessions endpointi backendda mavjud emas (backend kengaytmasi kerak).'
              : getErrorMessage(error)
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Seanslarni boshqarish</h1>
          <p className="text-xs text-zinc-400 mt-1">Jami: {data?.total ?? 0} ta seans</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Seans qo'shish
        </button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Seanslar yo'q"
          description="Hozircha hech qanday seans yaratilmagan."
          actionText="Yangilash"
          onAction={() => refetch()}
        />
      ) : (
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#18181F]/60">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">ID</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Film</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Zal</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Vaqt</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-[#27272A]/60 last:border-0 hover:bg-[#18181F]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-zinc-400">#{s.id}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{s.movieTitle || `Film #${s.movieId}`}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300">{s.hall}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300">{s.time ? formatDateTime(s.time) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-2 rounded-lg bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white transition-colors"
                          aria-label="Tahrirlash"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-colors"
                          aria-label="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={Boolean(modalState)}
        onClose={() => setModalState(null)}
        title={modalState?.mode === 'edit' ? 'Seansni tahrirlash' : 'Yangi seans'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Film *</label>
            <select
              value={form.movieId}
              onChange={(e) => setForm({ ...form, movieId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
            >
              <option value="">Filmni tanlang...</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Zal *</label>
            <input
              type="text"
              value={form.hall}
              onChange={(e) => setForm({ ...form, hall: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
              placeholder="Masalan: Zal 2 (Dolby Atmos)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Vaqt *</label>
            <input
              type="datetime-local"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] disabled:opacity-50 text-white text-sm font-bold transition-colors"
            >
              {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button
              type="button"
              onClick={() => setModalState(null)}
              className="px-5 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Seansni o'chirish">
        <div className="space-y-5">
          <p className="text-sm text-zinc-300 leading-relaxed">
            <span className="font-bold text-white">#{deleteTarget?.id}</span> seans o'chiriladi.
            Bu seansga tegishli bronlar qoladi, lekin yangi bron ola maydi.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold transition-colors"
            >
              {isSaving ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'}
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-5 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSessions;
