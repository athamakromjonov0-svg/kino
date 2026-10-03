import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Ticket, HelpCircle, MonitorPlay, Users, Layers, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#121216] border-t border-[#27272A] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-[#E50914]">
                <Film className="w-5 h-5 text-[#E50914]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                CINE<span className="text-[#E50914]">BOOK</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Eng so'nggi kinolarni tomosha qilish uchun qulay va ishonchli onlayn chipta bron qilish tizimi.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platforma faol holatda</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigatsiya
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-white transition-colors">
                  Barcha filmlar
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-white transition-colors">
                  Seanslar
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white transition-colors">
                  Mening chiptalarim
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Discover */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kashf qilish
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/actors" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  Aktyorlar
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  Kolleksiyalar
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MonitorPlay className="w-3 h-3" />
                  Watchlist
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Film className="w-3 h-3" />
                  Sharhlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Qulaylik va xavfsizlik */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Xavfsizlik & Sifat
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FF4D5A]" />
                <span>Xavfsiz onlayn to'lov va bron</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#22C55E]" />
                <span>Tezkor e-chipta tasdiqlash</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
                <span>24/7 foydalanuvchilarni qo'llab-quvvatlash</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#27272A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} CineBook Ultra. Barcha huquqlar himoyalangan.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" />
              Biz haqimizda
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Maxfiylik
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Shartlar
            </Link>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914]" />
              <span>for cinema lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
