import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

/**
 * User preferences — only real, working settings.
 * Theme is always dark (brand identity); language & toggles persist locally.
 */
export const useSettingsStore = create(
  persist(
    (set) => ({
      language: 'uz',
      emailNotifications: false,
      publicProfile: false,

      setLanguage: (language) => set({ language }),
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setPublicProfile: (value) => set({ publicProfile: value }),
    }),
    {
      name: STORAGE_KEYS.settings,
    }
  )
);

export default useSettingsStore;
