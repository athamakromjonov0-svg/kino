import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import { User, Mail, ShieldCheck, Ticket, LogOut, Heart, Film, ArrowRight } from 'lucide-react';

const FAVORITES_KEY = 'cinebook_favorites';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.name || user?.username || "Foydalanuvchi";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#27272A] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Foydalanuvchi Profili
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Shaxsiy hisob ma'lumotlari va faoliyatingiz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <Sidebar />
        </div>

        {/* Right Main Profile Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* User Card */}
          <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#E50914] to-[#FF4D5A] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[#E50914]/20 border-2 border-white/10 flex-shrink-0">
                {userInitial}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Tasdiqlangan Foydalanuvchi
                  </span>
                </div>
                <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{user?.email || "Email ko'rsatilmagan"}</span>
                </p>
                {user?.id && (
                  <p className="text-xs font-mono text-zinc-500">
                    Foydalanuvchi ID: #{user.id}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#27272A]">
              <Link
                to="/my-bookings"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#18181F] border border-[#27272A] hover:border-[#E50914]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Mening bronlarim</h4>
                    <p className="text-xs text-zinc-400">Buyurtma qilingan chiptalar</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/movies"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#18181F] border border-[#27272A] hover:border-zinc-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Filmlarni ko'rish</h4>
                    <p className="text-xs text-zinc-400">Yangi premyerlar katalogi</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Favorite Movies Section (Bonus) */}
          <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E50914] fill-[#E50914]" />
                <h3 className="text-base font-bold text-white">
                  Sevimli filmlar ({favorites.length})
                </h3>
              </div>

              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(FAVORITES_KEY);
                    setFavorites([]);
                  }}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Tozalash
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                Siz hali sevimli filmlar ro'yxatini yaratmadingiz. Filmlar kartasidagi yurakcha belgisini bosing!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favorites.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movies/${m.id}`}
                    className="group bg-[#18181F] rounded-xl overflow-hidden border border-[#27272A] hover:border-[#E50914]/40 transition-all flex flex-col"
                  >
                    <div className="aspect-[2/3] bg-zinc-900 overflow-hidden">
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-[#FF4D5A]">
                        {m.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
