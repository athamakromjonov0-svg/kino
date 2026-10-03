import React from 'react';
import { Settings as SettingsIcon, Server, Info, Database, Film } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

/**
 * AdminSettings — platform configuration overview.
 * Only shows REAL, working configuration; optional backend extensions
 * are clearly listed as "not yet available".
 */
export const AdminSettings = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Platforma sozlamalari</h1>
        <p className="text-xs text-zinc-400 mt-1">Tizim konfiguratsiyasi va holati</p>
      </div>

      {/* Environment */}
      <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-[#FF4D5A]" />
          Muhit (Environment)
        </h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#18181F] border border-[#27272A] rounded-xl px-4 py-3">
            <span className="text-xs text-zinc-400">API manzili (VITE_API_URL)</span>
            <code className="text-xs font-mono text-white bg-black/30 px-2 py-1 rounded-md border border-white/10 max-w-full truncate">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex items-center justify-between bg-[#18181F] border border-[#27272A] rounded-xl px-4 py-3">
            <span className="text-xs text-zinc-400">Autentifikatsiya</span>
            <span className="text-xs font-bold text-emerald-400">JWT (Bearer)</span>
          </div>
        </div>
      </section>

      {/* Working features */}
      <section className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FF4D5A]" />
          Faol modullar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Auth (login / register / me)',
            'Movies katalogi + paginatsiya',
            'Sessions seat map + bronlar',
            'Reviews (GET/POST)',
            'Actors + Collections',
            'Streaming manba yetkazib berish',
            'Admin stats (demo preview)',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 bg-[#18181F] border border-[#27272A] rounded-xl px-4 py-3">
              <Film className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs text-zinc-300">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Backend extensions needed */}
      <section className="bg-[#121216] border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4" />
          Backend kengaytmalari talab qilinadi
        </h2>
        <ul className="space-y-2">
          {[
            'POST /contact — aloqa formasi uchun',
            'GET /notifications — shaxsiy bildirishnomalar uchun',
            'PUT /users/:id/role — rolni o\'zgartirish uchun',
            'GET /search?q= — global qidiruv uchun',
            'Real-time statistika endpointlari (demo preview o\'rniga)',
          ].map((f) => (
            <li key={f} className="text-xs text-zinc-400 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              {f}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Bu endpointlar mavjud bo'lgunga qadar tegishli UI bo'limlari soxta muvaffaqiyat
          javoblarisiz, aniq holat ko'rsatadi.
        </p>
      </section>
    </div>
  );
};

export default AdminSettings;
