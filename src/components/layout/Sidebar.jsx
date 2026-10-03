import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Ticket, Film, Shield, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Sidebar = ({ className = '' }) => {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#8B5CF6] text-[#F8FAFC] shadow-lg shadow-[#8B5CF6]/20'
        : 'text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[#171A22]'
    }`;

  return (
    <aside className={`w-full md:w-64 bg-[#101218] border border-white/[0.08] rounded-2xl p-4 flex flex-col space-y-6 ${className}`}>
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.08] pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[#F8FAFC] font-bold uppercase shadow-sm">
          {user?.name ? user.name.charAt(0) : (user?.username ? user.username.charAt(0) : 'U')}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-[#F8FAFC] truncate">
            {user?.name || user?.username || "Foydalanuvchi"}
          </p>
          <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-1.5">
        <NavLink to="/profile" className={linkClass}>
          <User className="w-4 h-4" />
          <span>Profil ma'lumotlari</span>
        </NavLink>
        <NavLink to="/my-bookings" className={linkClass}>
          <Ticket className="w-4 h-4" />
          <span>Mening bronlarim</span>
        </NavLink>
        <NavLink to="/movies" className={linkClass}>
          <Film className="w-4 h-4" />
          <span>Barcha filmlar</span>
        </NavLink>
      </nav>

      <div className="pt-4 border-t border-white/[0.08] mt-auto">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
