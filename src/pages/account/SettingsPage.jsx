import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Globe, Bell, Lock, Save, Check } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import useSettingsStore from '../../store/useSettingsStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const LANGUAGES = [
  { code: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

/**
 * SettingsPage — only REAL, working settings:
 *  - language switcher (persists + applies instantly via i18next)
 *  - email notifications toggle (device-local preference)
 *  - public profile toggle (device-local preference)
 * Theme is always dark — it is the brand identity, so no fake theme switcher.
 */
export const SettingsPage = () => {
  const {
    language,
    emailNotifications,
    publicProfile,
    setLanguage,
    setEmailNotifications,
    setPublicProfile,
  } = useSettingsStore();
  const { t } = useTranslation();

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('cinebook_language', code);
    toast.success(`Til o'zgartirildi: ${LANGUAGES.find((l) => l.code === code)?.label}`);
  };

  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between gap-4 bg-[#18181F] border border-[#27272A] rounded-2xl p-4">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#E50914]' : 'bg-[#27272A]'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={SettingsIcon}
        title="Sozlamalar"
        subtitle="Profil va interfeys sozlamalari"
      />

      {/* Language */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#FF4D5A]" />
          {t('settings.language', 'Til')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleLanguageChange(l.code)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                language === l.code
                  ? 'bg-[#E50914]/15 border-[#E50914]/50 text-white'
                  : 'bg-[#18181F] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{l.flag}</span>
                {l.label}
              </span>
              {language === l.code && <Check className="w-4 h-4 text-[#FF4D5A]" />}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF4D5A]" />
          Bildirishnomalar
        </h2>
        <Toggle
          checked={emailNotifications}
          onChange={(v) => {
            setEmailNotifications(v);
            toast.success(v ? 'Email bildirishnomalari yoqildi' : 'Email bildirishnomalari o\'chirildi');
          }}
          label="Email bildirishnomalari"
          description="Bron tasdiqlari va yangi seanslar haqida xabar olish"
        />
      </section>

      {/* Privacy */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#FF4D5A]" />
          Maxfiylik
        </h2>
        <Toggle
          checked={publicProfile}
          onChange={setPublicProfile}
          label="Ommaviy profil"
          description="Sharhlaringiz boshqa foydalanuvchilarga ismingiz bilan ko'rinadi"
        />
      </section>

      {/* Honest note about theme */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-4 text-xs text-zinc-400 leading-relaxed">
        Mavzu (theme) doim <span className="text-white font-semibold">qorong'u (dark)</span> — bu Cineora brend identifikatori.
        Sozlamalar qurilmangizda (localStorage) saqlanadi.
      </div>
    </div>
  );
};

export default SettingsPage;
