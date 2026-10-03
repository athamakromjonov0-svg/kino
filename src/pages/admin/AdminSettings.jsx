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
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Platforma sozlamalari</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Tizim konfiguratsiyasi va holati</p>
      </div>

      {/* Environment */}
      <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-[0.08em] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#A78BFA]" />
          Muhit (Environment)
        </h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#171A22] border border-white/[0.08] rounded-xl px-4 py-3">
            <span className="text-xs text-[#9CA3AF]">API manzili (VITE_API_URL)</span>
            <code className="text-xs font-mono text-[#F8FAFC] bg-black/30 px-2 py-1 rounded-md border border-white/10 max-w-full truncate">
              {API_BASE_URL}
            </code>
          </div>
          <div className="flex items-center justify-between bg-[#171A22] border border-white/[0.08] rounded-xl px-4 py-3">
            <span className="text-xs text-[#9CA3AF]">Autentifikatsiya</span>
            <span className="text-xs font-bold text-[#34D399]">JWT (Bearer)</span>
          </div>
        </div>
      </section>

      {/* Working features */}
      <section className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-[0.08em] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#A78BFA]" />
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
            <div key={f} className="flex items-center gap-2.5 bg-[#171A22] border border-white/[0.08] rounded-xl px-4 py-3">
              <Film className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span className="text-xs text-[#D1D5DB]">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Backend extensions needed */}
      <section className="bg-[#101218] border border-[#F59E0B]/[0.3] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#FBBF24] uppercase tracking-[0.08em] flex items-center gap-2">
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
            <li key={f} className="text-xs text-[#9CA3AF] flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shrink-0 mt-1.5" />
              {f}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-[#6B7280] leading-relaxed">
          Bu endpointlar mavjud bo'lgunga qadar tegishli UI bo'limlari soxta muvaffaqiyat
          javoblarisiz, aniq holat ko'rsatadi.
        </p>
      </section>
    </div>
  );
};

export default AdminSettings;
