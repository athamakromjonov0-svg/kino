import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Film, Plus, Pencil, Trash2, Search, RefreshCw,
} from 'lucide-react';
import movieService from '../../services/movieService';
import adminService from '../../services/adminService';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';
import { KNOWN_GENRES } from '../../constants';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

const EMPTY_FORM = { title: '', genre: 'Action', description: '', poster: '' };

/**
 * AdminMovies — full CRUD over backend extension endpoints
 * POST/PUT/DELETE /movies (admin role required on the server).
 */
export const AdminMovies = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [modalState, setModalState] = useState(null); // { mode: 'create' | 'edit', movie? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-movies', page],
    queryFn: () => movieService.getMovies({ page, limit: 10 }),
    retry: 1,
  });

  const movies = data?.movies || [];
  const totalPages = data?.totalPages || 1;

  const filtered = query
    ? movies.filter((m) => (m.title || '').toLowerCase().includes(query.toLowerCase()))
    : movies;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalState({ mode: 'create' });
  };

  const openEdit = (movie) => {
    setForm({
      title: movie.title || '',
      genre: movie.genre || 'Action',
      description: movie.description || '',
      poster: movie.poster || '',
    });
    setModalState({ mode: 'edit', movie });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Film nomi bo\'sh bo\'lmasligi kerak');
      return;
    }
    setIsSaving(true);
    try {
      if (modalState.mode === 'create') {
        await adminService.createMovie(form);
        toast.success('Film qo\'shildi');
      } else {
        await adminService.updateMovie(modalState.movie.id, form);
        toast.success('Film yangilandi');
      }
      setModalState(null);
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Ruxsat yo\'q: faqat admin foydalanuvchilar uchun (403)');
      } else if (err.response?.status === 404) {
        toast.error('Backendda POST/PUT /movies endpoint mavjud emas (404) — README\'ga qarang');
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
      await adminService.deleteMovie(deleteTarget.id);
      toast.success('Film o\'chirildi');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Ruxsat yo\'q: faqat admin foydalanuvchilar uchun (403)');
      } else if (err.response?.status === 404) {
        toast.error('Backendda DELETE /movies/:id endpoint mavjud emas (404)');
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen text="Filmlar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState title="Filmlarni yuklab bo'lmadi" message={getErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Filmlarni boshqarish</h1>
          <p className="text-xs text-zinc-400 mt-1">Jami: {data?.total ?? 0} ta film</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]/60 w-44 sm:w-56"
            />
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Film qo'shish
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Film}
          title="Filmlar topilmadi"
          description="Qidiruvga mos film yo'q yoki katalog bo'sh."
          actionText="Yangilash"
          onAction={() => refetch()}
        />
      ) : (
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#18181F]/60">
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Film</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Janr</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Seanslar</th>
                  <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-[#27272A]/60 last:border-0 hover:bg-[#18181F]/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.poster || FALLBACK_POSTER}
                          alt={m.title}
                          className="w-9 h-12 object-cover rounded-lg border border-[#27272A]"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate max-w-[220px]">{m.title}</p>
                          <p className="text-[11px] text-zinc-500">ID: #{m.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4D5A] text-[11px] font-bold">
                        {m.genre}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-300">
                      {(m.sessions || []).length} ta
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="p-2 rounded-lg bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                          aria-label="Tahrirlash"
                          title="Tahrirlash"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-colors"
                          aria-label="O'chirish"
                          title="O'chirish"
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

          {/* Pagination */}
          {totalPages > 1 && !query && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs text-zinc-300 disabled:opacity-40 hover:text-white"
              >
                Oldingi
              </button>
              <span className="text-xs text-zinc-400">{page} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs text-zinc-300 disabled:opacity-40 hover:text-white"
              >
                Keyingi
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={Boolean(modalState)}
        onClose={() => setModalState(null)}
        title={modalState?.mode === 'edit' ? 'Filmni tahrirlash' : 'Yangi film qo\'shish'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nomi *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
              placeholder="Film nomi"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Janr</label>
            <select
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
            >
              {KNOWN_GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tavsif</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60 resize-none"
              placeholder="Film haqida qisqacha..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Poster URL</label>
            <input
              type="url"
              value={form.poster}
              onChange={(e) => setForm({ ...form, poster: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121216] border border-[#27272A] text-sm text-white focus:outline-none focus:border-[#E50914]/60"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] disabled:opacity-50 text-white text-sm font-bold transition-colors"
            >
              {isSaving ? 'Saqlanmoqda...' : modalState?.mode === 'edit' ? 'Saqlash' : 'Qo\'shish'}
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
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Filmni o'chirish"
      >
        <div className="space-y-5">
          <p className="text-sm text-zinc-300 leading-relaxed">
            <span className="font-bold text-white">{deleteTarget?.title}</span> filmi va uning barcha
            seanslari o'chiriladi. Bu amalni qaytarib bo'lmaydi.
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

export default AdminMovies;
