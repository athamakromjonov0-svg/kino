import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Film, User, LogOut, Ticket, Menu, X, Search, ChevronDown, Heart, Globe, MonitorPlay, ShieldCheck, Settings, Clapperboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useSettingsStore from '../../store/useSettingsStore';
import i18n from '../../i18n';

const LANGS = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export const Navbar = ({ onOpenSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useSettingsStore();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection for glassy navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('cinebook_language', code);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 relative py-1 ${
      isActive
        ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E50914] after:rounded-full'
        : 'text-zinc-400 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive
        ? 'bg-[#18181F] text-white border-l-4 border-[#E50914]'
        : 'text-zinc-400 hover:bg-[#18181F] hover:text-white'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A] shadow-xl shadow-black/50 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-[#E50914] group-hover:scale-105 group-hover:border-[#E50914]/40 transition-all duration-200 shadow-md shadow-[#E50914]/10">
              <Film className="w-5 h-5 text-[#E50914] fill-[#E50914]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                CINE<span className="text-[#E50914]">BOOK</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold -mt-1">
                Cinema Platform
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              {t('nav.home', 'Bosh sahifa')}
            </NavLink>
            <NavLink to="/movies" className={navLinkClass}>
              {t('nav.movies', 'Filmlar')}
            </NavLink>
            <NavLink
              to="/catalog/archive"
              className={(state) => `${navLinkClass(state)} hidden lg:inline-block`}
            >
              {t('nav.archive', 'Archive')}
            </NavLink>
            <NavLink to="/sessions" className={navLinkClass}>
              {t('nav.sessions', 'Seanslar')}
            </NavLink>
            <NavLink to="/community" className={navLinkClass}>
              Hamjamiyat
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={navLinkClass}>
                {t('nav.myBookings', 'Mening bronlarim')}
              </NavLink>
            )}
          </nav>

          {/* Right: Actions & User menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language switcher */}
            <div className="flex items-center rounded-lg bg-[#18181F] border border-[#27272A] p-0.5">
              <Globe className="w-3.5 h-3.5 text-zinc-500 ml-2" />
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    language === l.code ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  aria-label={`Til: ${l.label}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181F] border border-transparent hover:border-[#27272A] transition-all focus:outline-none"
              title="Filmlarni qidirish"
              aria-label="Filmlarni qidirish"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#18181F] hover:bg-[#27272A] border border-[#27272A] transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FF4D5A] flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                    {user?.name ? user.name.charAt(0) : (user?.username ? user.username.charAt(0) : 'U')}
                  </div>
                  <span className="text-xs font-medium text-white max-w-[100px] truncate">
                    {user?.name || user?.username || user?.email?.split('@')[0] || "Foydalanuvchi"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#18181F] border border-[#27272A] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#27272A]/70">
                      <p className="text-xs font-semibold text-white truncate">
                        {user?.name || user?.username || "Foydalanuvchi"}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#27272A]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-[#FF4D5A]" />
                      Profil ma'lumotlari
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#27272A]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      Mening bronlarim
                    </Link>

                    <Link
                      to="/watchlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#27272A]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <MonitorPlay className="w-4 h-4 text-blue-400" />
                      Watchlist
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-[#27272A]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-zinc-400" />
                      Sozlamalar
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-[#27272A]/70 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Chiqish (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-[#18181F] transition-all"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-[#E50914] hover:bg-[#c40811] text-white px-4 py-2 rounded-lg shadow-md shadow-[#E50914]/20 transition-all hover:shadow-[#E50914]/40"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile language switcher */}
            <div className="flex items-center rounded-lg bg-[#18181F] border border-[#27272A] p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                    language === l.code ? 'bg-[#E50914] text-white' : 'text-zinc-400'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181F] focus:outline-none"
              aria-label="Qidirish"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181F] focus:outline-none"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <NavLink to="/" className={mobileNavLinkClass}>
              <Film className="w-5 h-5 text-[#E50914]" />
              Bosh sahifa
            </NavLink>
            <NavLink to="/movies" className={mobileNavLinkClass}>
              <Film className="w-5 h-5 text-zinc-400" />
              Filmlar
            </NavLink>
            <NavLink to="/catalog/archive" className={mobileNavLinkClass}>
              <Clapperboard className="w-5 h-5 text-zinc-400" />
              {t('nav.archive', 'Archive')}
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={mobileNavLinkClass}>
                <Ticket className="w-5 h-5 text-emerald-400" />
                Mening bronlarim
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/profile" className={mobileNavLinkClass}>
                <User className="w-5 h-5 text-[#FF4D5A]" />
                Profilim
              </NavLink>
            )}
          </nav>

          <div className="pt-4 border-t border-[#27272A]">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-2">
                  <p className="text-xs text-zinc-400">Tizimga kirgan:</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || user?.username || user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-950/40 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-900/40"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish (Logout)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#18181F] text-white border border-[#27272A] text-sm font-medium hover:bg-[#27272A]"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#E50914] text-white text-sm font-medium hover:bg-[#c40811] shadow-md shadow-[#E50914]/20"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
