import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Film, Clock, Ticket, Users, BarChart3, Settings,
  ArrowLeft, ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/movies', icon: Film, label: 'Filmlar' },
  { to: '/admin/sessions', icon: Clock, label: 'Seanslar' },
  { to: '/admin/bookings', icon: Ticket, label: 'Bronlar' },
  { to: '/admin/users', icon: Users, label: 'Foydalanuvchilar' },
  { to: '/admin/reports', icon: BarChart3, label: 'Hisobotlar' },
  { to: '/admin/settings', icon: Settings, label: 'Sozlamalar' },
];

/**
 * AdminLayout — shell for the admin panel. Route-level access is already
 * guarded by AdminRoute (role: 'admin' from backend /auth/me).
 */
export const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-[#121216] border-b lg:border-b-0 lg:border-r border-[#27272A] lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E50914] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white tracking-tight">
                CINE<span className="text-[#E50914]">BOOK</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#FF4D5A] font-bold">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-3 gap-1 lg:space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#E50914]/15 border border-[#E50914]/40 text-white'
                    : 'border border-transparent text-zinc-400 hover:text-white hover:bg-[#18181F]'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-[#27272A] hidden lg:block">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Saytga qaytish
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
