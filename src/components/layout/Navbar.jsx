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
    `text-[13px] font-medium transition-all duration-200 ease-premium relative py-1.5 ${
      isActive
        ? 'text-[#F8FAFC] font-semibold after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#8B5CF6] after:to-[#A78BFA] after:rounded-full after:shadow-[0_0_10px_rgba(139,92,246,0.7)]'
        : 'text-[#9CA3AF] hover:text-[#F8FAFC]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-[#8B5CF6]/12 text-[#F8FAFC] border-l-[3px] border-[#8B5CF6]'
        : 'text-[#9CA3AF] hover:bg-white/[0.05] hover:text-[#F8FAFC]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-premium ${
        isScrolled
          ? 'bg-[#08090D]/85 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_8px_32px_-16px_rgba(0,0,0,0.9)] py-3'
          : 'bg-gradient-to-b from-[#08090D]/70 to-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#A78BFA]/10 border border-[#8B5CF6]/25 flex items-center justify-center group-hover:scale-105 group-hover:border-[#8B5CF6]/50 group-hover:shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)] transition-all duration-300 ease-premium">
              <Film className="w-5 h-5 text-[#A78BFA] fill-[#A78BFA]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-[-0.02em] text-[#F8FAFC] leading-none flex items-center">
                CINE<span className="text-[#8B5CF6]">ORA</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#6B7280] font-semibold mt-1">
                Cinema Platform
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
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
            <div className="flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] p-0.5 backdrop-blur-sm">
              <Globe className="w-3.5 h-3.5 text-[#6B7280] ml-2.5" />
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 ${
                    language === l.code
                      ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] shadow-[0_2px_10px_-2px_rgba(139,92,246,0.8)]'
                      : 'text-[#9CA3AF] hover:text-[#F8FAFC]'
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
              className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200 focus:outline-none"
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
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[#F8FAFC] text-xs font-bold uppercase shadow-[0_2px_10px_-2px_rgba(139,92,246,0.7)]">
                    {user?.name ? user.name.charAt(0) : (user?.username ? user.username.charAt(0) : 'U')}
                  </div>
                  <span className="text-xs font-medium text-[#F8FAFC] max-w-[100px] truncate">
                    {user?.name || user?.username || user?.email?.split('@')[0] || "Foydalanuvchi"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#171A22] border border-white/[0.08] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-white/[0.08]/70">
                      <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {user?.name || user?.username || "Foydalanuvchi"}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#D1D5DB] hover:text-[#F8FAFC] hover:bg-white/[0.04]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-[#A78BFA]" />
                      Profil ma'lumotlari
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#D1D5DB] hover:text-[#F8FAFC] hover:bg-white/[0.04]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Ticket className="w-4 h-4 text-[#34D399]" />
                      Mening bronlarim
                    </Link>

                    <Link
                      to="/watchlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#D1D5DB] hover:text-[#F8FAFC] hover:bg-white/[0.04]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <MonitorPlay className="w-4 h-4 text-[#60A5FA]" />
                      Watchlist
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#D1D5DB] hover:text-[#F8FAFC] hover:bg-white/[0.04]/50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-[#9CA3AF]" />
                      Sozlamalar
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#FBBF24] hover:text-[#FCD34D] hover:bg-[#F59E0B]/[0.08] transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-white/[0.08]/70 my-1" />

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
                  className="text-sm font-medium text-[#D1D5DB] hover:text-[#F8FAFC] px-3 py-2 rounded-lg hover:bg-[#171A22] transition-all"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] px-4 py-2 rounded-lg shadow-md shadow-[#8B5CF6]/20 transition-all hover:shadow-[#8B5CF6]/40"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile language switcher */}
            <div className="flex items-center rounded-lg bg-[#171A22] border border-white/[0.08] p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-1.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                    language === l.code ? 'bg-[#8B5CF6] text-[#F8FAFC]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] rounded-lg hover:bg-[#171A22] focus:outline-none"
              aria-label="Qidirish"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#9CA3AF] hover:text-[#F8FAFC] rounded-lg hover:bg-[#171A22] focus:outline-none"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#08090D]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <NavLink to="/" className={mobileNavLinkClass}>
              <Film className="w-5 h-5 text-[#8B5CF6]" />
              Bosh sahifa
            </NavLink>
            <NavLink to="/movies" className={mobileNavLinkClass}>
              <Film className="w-5 h-5 text-[#9CA3AF]" />
              Filmlar
            </NavLink>
            <NavLink to="/catalog/archive" className={mobileNavLinkClass}>
              <Clapperboard className="w-5 h-5 text-[#9CA3AF]" />
              {t('nav.archive', 'Archive')}
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={mobileNavLinkClass}>
                <Ticket className="w-5 h-5 text-[#34D399]" />
                Mening bronlarim
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/profile" className={mobileNavLinkClass}>
                <User className="w-5 h-5 text-[#A78BFA]" />
                Profilim
              </NavLink>
            )}
          </nav>

          <div className="pt-4 border-t border-white/[0.08]">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-2">
                  <p className="text-xs text-[#9CA3AF]">Tizimga kirgan:</p>
                  <p className="text-sm font-semibold text-[#F8FAFC] truncate">
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
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#171A22] text-[#F8FAFC] border border-white/[0.08] text-sm font-medium hover:bg-white/[0.04]"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#8B5CF6] text-[#F8FAFC] text-sm font-medium hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/20"
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
