import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Ticket, Film, Shield, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Sidebar = ({ className = '' }) => {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20'
        : 'text-zinc-400 hover:text-white hover:bg-[#18181F]'
    }`;

  return (
    <aside className={`w-full md:w-64 bg-[#121216] border border-[#27272A] rounded-2xl p-4 flex flex-col space-y-6 ${className}`}>
      <div className="flex items-center gap-3 px-3 py-2 border-b border-[#27272A] pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF4D5A] flex items-center justify-center text-white font-bold uppercase shadow-sm">
          {user?.name ? user.name.charAt(0) : (user?.username ? user.username.charAt(0) : 'U')}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name || user?.username || "Foydalanuvchi"}
          </p>
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
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

      <div className="pt-4 border-t border-[#27272A] mt-auto">
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
