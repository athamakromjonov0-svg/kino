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
    <div className="flex items-center justify-between gap-4 bg-[#171A22] border border-white/[0.08] rounded-2xl p-4">
      <div>
        <p className="text-sm font-semibold text-[#F8FAFC]">{label}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#8B5CF6]' : 'bg-white/[0.04]'}`}
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
        <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-[0.08em] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#A78BFA]" />
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
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#F8FAFC]'
                  : 'bg-[#171A22] border-white/[0.08] text-[#D1D5DB] hover:text-[#F8FAFC] hover:border-white/[0.14]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{l.flag}</span>
                {l.label}
              </span>
              {language === l.code && <Check className="w-4 h-4 text-[#A78BFA]" />}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-[0.08em] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#A78BFA]" />
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
        <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-[0.08em] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#A78BFA]" />
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
      <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-4 text-xs text-[#9CA3AF] leading-relaxed">
        Mavzu (theme) doim <span className="text-[#F8FAFC] font-semibold">qorong'u (dark)</span> — bu Cineora brend identifikatori.
        Sozlamalar qurilmangizda (localStorage) saqlanadi.
      </div>
    </div>
  );
};

export default SettingsPage;
