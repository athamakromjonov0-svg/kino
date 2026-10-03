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
      <aside className="lg:w-64 lg:min-h-screen bg-[#101218] border-b lg:border-b-0 lg:border-r border-white/[0.08] lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F8FAFC]" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#F8FAFC] tracking-tight">
                CINE<span className="text-[#8B5CF6]">ORA</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#A78BFA] font-bold">
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
                    ? 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#F8FAFC]'
                    : 'border border-transparent text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#171A22]'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-white/[0.08] hidden lg:block">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#171A22] transition-colors"
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
