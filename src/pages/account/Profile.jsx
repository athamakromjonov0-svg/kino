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
      <div className="border-b border-white/[0.08] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Foydalanuvchi Profili
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
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
          <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[#F8FAFC] text-3xl font-black shadow-xl shadow-[#8B5CF6]/20 border-2 border-white/10 flex-shrink-0">
                {userInitial}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-[#F8FAFC]">{displayName}</h2>
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/[0.10] border border-[#22C55E]/[0.22] text-[#34D399] text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Tasdiqlangan Foydalanuvchi
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>{user?.email || "Email ko'rsatilmagan"}</span>
                </p>
                {user?.id && (
                  <p className="text-xs font-mono text-[#6B7280]">
                    Foydalanuvchi ID: #{user.id}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <Link
                to="/my-bookings"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#171A22] border border-white/[0.08] hover:border-[#8B5CF6]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Mening bronlarim</h4>
                    <p className="text-xs text-[#9CA3AF]">Buyurtma qilingan chiptalar</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#F8FAFC] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/movies"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#171A22] border border-white/[0.08] hover:border-white/[0.14] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/[0.10] text-[#A78BFA] flex items-center justify-center">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Filmlarni ko'rish</h4>
                    <p className="text-xs text-[#9CA3AF]">Yangi premyerlar katalogi</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#F8FAFC] group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Favorite Movies Section (Bonus) */}
          <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#8B5CF6] fill-[#8B5CF6]" />
                <h3 className="text-base font-bold text-[#F8FAFC]">
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
                  className="text-xs text-[#9CA3AF] hover:text-red-400 transition-colors"
                >
                  Tozalash
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <p className="text-xs text-[#6B7280] py-4 text-center">
                Siz hali sevimli filmlar ro'yxatini yaratmadingiz. Filmlar kartasidagi yurakcha belgisini bosing!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favorites.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movies/${m.id}`}
                    className="group bg-[#171A22] rounded-xl overflow-hidden border border-white/[0.08] hover:border-[#8B5CF6]/40 transition-all flex flex-col"
                  >
                    <div className="aspect-[2/3] bg-[#0B0D12] overflow-hidden">
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <h5 className="text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#A78BFA]">
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
