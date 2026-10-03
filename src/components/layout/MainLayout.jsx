import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MovieSearch from '../movies/MovieSearch';
import movieService from '../../services/movieService';
import { ArrowUp, WifiOff } from 'lucide-react';

export const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchableMovies, setSearchableMovies] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-fetch a batch of movies for global search modal
  useEffect(() => {
    let isMounted = true;
    movieService
      .getMovies({ page: 1, limit: 20 })
      .then((res) => {
        if (isMounted && res.movies) {
          setSearchableMovies(res.movies);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC] flex flex-col antialiased selection:bg-[#8B5CF6] selection:text-[#F8FAFC]">
      {/* Offline warning banner */}
      {isOffline && (
        <div className="bg-[#8B5CF6] text-[#F8FAFC] text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Internet bilan aloqa uzildi. Iltimos, tarmoqni tekshiring.</span>
        </div>
      )}

      {/* Sticky Main Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Movie Search Modal */}
      <MovieSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allMovies={searchableMovies}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-xl bg-[#171A22] hover:bg-[#8B5CF6] text-[#F8FAFC] border border-white/[0.08] hover:border-[#8B5CF6] shadow-2xl transition-all duration-300 z-40 hover:scale-110 focus:outline-none"
          aria-label="Yuqoriga qaytish"
          title="Yuqoriga qaytish"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
