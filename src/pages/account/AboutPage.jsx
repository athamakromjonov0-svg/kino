import React from 'react';
import { Link } from 'react-router-dom';
import {
  Info, Film, Ticket, MonitorPlay, Users, ShieldCheck, Layers, Globe,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

const FEATURES = [
  { icon: Film, title: 'Kino katalogi', desc: 'Filmlarni janr, reyting va yangiliklar bo\'yicha kashf qiling' },
  { icon: Ticket, title: 'Chipta bron', desc: 'Interaktiv zal xaritasidan joyni tanlang va bir zumda bron qiling' },
  { icon: MonitorPlay, title: 'Onlayn ko\'rish', desc: 'Faqat qonuniy video manbalar orqali tomosha qiling' },
  { icon: Users, title: 'Hamjamiyat', desc: 'Sharhlar, aktyorlar va kolleksiyalar bilan almashing' },
  { icon: ShieldCheck, title: 'Xavfsizlik', desc: 'JWT autentifikatsiya va role-based ruxsatlar' },
  { icon: Globe, title: '3 tilda', desc: 'O\'zbekcha, ruscha va inglizcha interfeys' },
];

const STACK = [
  'React 18', 'Vite', 'Tailwind CSS', 'React Router', 'Axios', 'Zustand',
  'React Hook Form', 'Zod', 'Recharts', 'hls.js', 'i18next', 'Framer Motion',
];

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-12">
      <PageHeader
        icon={Info}
        title="Biz haqimizda"
        subtitle="CINEORA — EVERY STORY STARTS HERE"
      />

      {/* Hero statement */}
      <section className="bg-gradient-to-r from-[#171A22] to-[#101218] border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#8B5CF6]/30">
          <Film className="w-8 h-8 text-[#F8FAFC]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Har bir hikoya shu yerdan boshlanadi
        </h2>
        <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-2xl mx-auto">
          Cineora — bu streaming, kinoteatr chiptalari, film ma'lumotlar bazasi va
          kino hamjamiyatini birlashtirgan zamonaviy platforma. Bizning maqsadimiz — kino
          sevgililariga eng qulay va ishonchli tajribani taqdim etish.
        </p>
      </section>

      {/* Features grid */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-[#F8FAFC]">Nimalarni taklif qilamiz</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[#101218] border border-white/[0.08] rounded-2xl p-5 space-y-2 hover:border-[#8B5CF6]/40 transition-colors"
            >
              <f.icon className="w-6 h-6 text-[#8B5CF6]" />
              <h4 className="text-sm font-bold text-[#F8FAFC]">{f.title}</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#F8FAFC]">Bizning tamoyillar</h3>
        <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 space-y-4 text-sm text-[#D1D5DB] leading-relaxed">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-[#F8FAFC]">Qonuniy kontent.</span> Biz faqat litsenziyalangan
              yoki ommaviy video manbalardan foydalanamiz va ruxsatsiz nusxalarni hech qachon ko'rsatmaymiz.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-[#F8FAFC]">Shaffoflik.</span> Qaysi ma'lumot qayerdan olingani
              va qaysi funksiyalar qurilmangizda saqlani aniqligicha ko'rsatiladi.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#F8FAFC]">Texnologiyalar</h3>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-lg bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-sm font-bold transition-colors"
        >
          Katalogni kashf qilish
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
