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
        subtitle="CINEBOOK ULTRA — EVERY STORY STARTS HERE"
      />

      {/* Hero statement */}
      <section className="bg-gradient-to-r from-[#18181F] to-[#121216] border border-[#27272A] rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E50914] flex items-center justify-center shadow-2xl shadow-[#E50914]/30">
          <Film className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Har bir hikoya shu yerdan boshlanadi
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          CineBook Ultra — bu streaming, kinoteatr chiptalari, film ma'lumotlar bazasi va
          kino hamjamiyatini birlashtirgan zamonaviy platforma. Bizning maqsadimiz — kino
          sevgililariga eng qulay va ishonchli tajribani taqdim etish.
        </p>
      </section>

      {/* Features grid */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-white">Nimalarni taklif qilamiz</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2 hover:border-[#E50914]/40 transition-colors"
            >
              <f.icon className="w-6 h-6 text-[#E50914]" />
              <h4 className="text-sm font-bold text-white">{f.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Bizning tamoyillar</h3>
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-4 text-sm text-zinc-300 leading-relaxed">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-white">Qonuniy kontent.</span> Biz faqat litsenziyalangan
              yoki ommaviy video manbalardan foydalanamiz va ruxsatsiz nusxalarni hech qachon ko'rsatmaymiz.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#FF4D5A] shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-white">Shaffoflik.</span> Qaysi ma'lumot qayerdan olingani
              va qaysi funksiyalar qurilmangizda saqlani aniqligicha ko'rsatiladi.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Texnologiyalar</h3>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-lg bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-sm font-bold transition-colors"
        >
          Katalogni kashf qilish
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
