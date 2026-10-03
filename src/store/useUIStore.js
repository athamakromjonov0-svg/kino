import { create } from 'zustand';

/**
 * Global UI state (non-persistent).
 */
export const useUIStore = create((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isSidebarOpen: false,

  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useUIStore;
