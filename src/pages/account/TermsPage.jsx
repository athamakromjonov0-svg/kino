import React from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

const SECTIONS = [
  {
    title: '1. Umumiy qoidalar',
    body: 'Cineora (keyingi o\'rinlarda «Platforma») — kino katalogi, chipta bron qilish va qonuniy onlayn tomosha xizmatlari. Platformadan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.',
  },
  {
    title: '2. Hisob va xavfsizlik',
    body: 'Ro\'yxatdan o\'tishda kiritgan ma\'lumotlaringiz to\'g\'riligi uchun javobgarsiz. Hisobingiz va parolingiz maxfiy — ularni uchinchi shaxslarga bermang. Hisobingiz orqali amalga oshirilgan har bir bron sizning javobgarligingizdadir.',
  },
  {
    title: '3. Chipta bron qilish',
    body: [
      'Bir bron uchun maksimal 4 tagacha joy tanlash mumkin.',
      'Joylar real vaqt rejimida tasdiqlanadi: agar joy allaqachon band bo\'lsa, server 409 (conflict) xatosini qaytaradi va boshqa joy tanlashingiz so\'raladi.',
      'Bronni «Mening bronlarim» sahifasi orqali bekor qilish mumkin. Bekor qilinganda joy darhol boshqalar uchun bo\'shaydi.',
    ],
  },
  {
    title: '4. Onlayn tomosha (streaming)',
    body: [
      'Platformada faqat qonuniy video manbalar ko\'rsatiladi: litsenziyalangan oqimlar, ommaviy demo materiallar va rasmiy embed pleyerlar.',
      'Video manba mavjud bo\'lmagan filmlar uchun «Streaming mavjud emas» holati ko\'rsatiladi.',
      'Platformadan kontentni yozib olish, tarqatish yoki ruxsatsiz manbalarga ulash taqiqlanadi.',
    ],
  },
  {
    title: '5. Foydalanuvchi kontenti',
    body: 'Yozgan sharhlaringiz uchun javobgarsiz. Haqoratli, spam yoki qonunga xilof matnlar moderatsiyasiz o\'chirilishi mumkin. Sharh yozish funksiyasi backenddagi reviews API mavjudligiga bog\'liq.',
  },
  {
    title: '6. Xizmat cheklovlari',
    body: [
      'Platforma ba\'zi funksiyalar uchun tashqi xizmatlarga (kinoteatrlar, video provayderlar) tayanadi — ularning uzilishi natijasidagi to\'xtashlar uchun javobgarlik cheklangan.',
      'Ma\'lumotlar (film meta ma\'lumotlari, seanslar) provayder tomonidan taqdim etilganidek ko\'rsatiladi.',
    ],
  },
  {
    title: '7. Shartlarga o\'zgartirish',
    body: 'Ushbu shartlar vaqti-vaqti bilan yangilanishi mumkin. Muhim o\'zgarishlar bo\'lganda saytda aniq e\'lon qilinadi. Shartlarni davriy ravishda ko\'rib borishingizni so\'raymiz.',
  },
];

export const TermsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={FileText}
        title="Foydalanish shartlari"
        subtitle="Platformadan foydalanish qoidalari"
      />

      <p className="text-xs text-zinc-500">
        Oxirgi yangilanish: 2026-yil oktyabr.
      </p>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            {Array.isArray(s.body) ? (
              <ul className="space-y-2">
                {s.body.map((p, i) => (
                  <li key={i} className="text-xs sm:text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0 mt-1.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{s.body}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
