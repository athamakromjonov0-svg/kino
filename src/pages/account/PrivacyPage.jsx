import React from 'react';
import { Shield } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

const SECTIONS = [
  {
    title: '1. Qanday ma\'lumotlarni yig\'amiz',
    body: [
      'Ro\'yxatdan o\'tishda: ism, email manzil va parol (parol xeshlangan holda backendda saqlanadi).',
      'Bron qilishda: tanlangan seans, qator va joy ma\'lumotlari.',
      'Texnik ma\'lumotlar: brauzer turi, IP manzil va server loglari — xizmat xavfsizligi uchun.',
    ],
  },
  {
    title: '2. Qurilmangizda saqlanadigan ma\'lumotlar (localStorage)',
    body: [
      'Watchlist, Sevimlilar, Yaqinda ko\'rilgan filmlar va ijro holati FAQAT brauzeringizning localStorage xotirasida saqlanadi.',
      'Bu ma\'lumotlar serverga yuborilmaydi va hech qanday profilingizni tuzish uchun ishlatilmaydi.',
      'Brauzer sozlamalaridan sayt ma\'lumotlarini tozalash orqali ularni o\'chirishingiz mumkin.',
    ],
  },
  {
    title: '3. Ma\'lumotlardan foydalanish',
    body: [
      'Bronlarni tasdiqlash va chiptalarni boshqarish.',
      'Platforma xavfsizligini ta\'minlash va suiiste\'molliklarni aniqlash.',
      'Foydalanuvchi roziligi bo\'lganda — yangi seanslar va premyeralar haqida xabar berish.',
    ],
  },
  {
    title: '4. Ma\'lumotlarni uchinchi shaxslarga berish',
    body: [
      'Shaxsiy ma\'lumotlaringizni sotmaymiz va reklama maqsadida uchinchi shaxslarga bermaymiz.',
      'Qonun talab qilgan hollarda yoki xizmat ishlashi uchun zarur bo\'lganda (masalan, kinoteatr bilan bron ma\'lumotlari) cheklangan holda foydalanilishi mumkin.',
    ],
  },
  {
    title: '5. Ma\'lumot xavfsizligi',
    body: [
      'Barcha so\'rovlar JWT token asosida autentifikatsiya qilinadi.',
      'Parollar xeshlangan holda saqlanadi va frontendga hech qachon qaytarilmaydi.',
      'Maxfiy kalitlar (JWT secret, API keylar) hech qachon frontend kodiga kiritilmaydi.',
    ],
  },
  {
    title: '6. Video kontent va tashqi manbalar',
    body: [
      'Video pleyer faqat qonuniy manbalarga ulanadi: litsenziyalangan oqimlar, ommaviy demo streamlar va rasmiy embed pleyerlar.',
      'Rasmiy embed pleyerlar (masalan, YouTube) o\'zining maxfiylik siyosatiga ega — ularning cookie siyosati ustidan nazoratimiz yo\'q.',
    ],
  },
  {
    title: '7. O\'z huquqlaringiz',
    body: [
      'Hisobingizni o\'chirishni va shaxsiy ma\'lumotlaringizni olib tashlashni so\'rashingiz mumkin.',
      'Saqlangan ma\'lumotlaringiz haqida ma\'lumot olish uchun support@cinebook.uz manziliga murojaat qiling.',
    ],
  },
];

export const PrivacyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Shield}
        title="Maxfiylik siyosati"
        subtitle="Shaxsiy ma'lumotlaringiz bilan qanday ishlaymiz"
      />

      <p className="text-xs text-zinc-500">
        Oxirgi yangilanish: 2026-yil oktyabr. Ushbu siyosa CineBook Ultra platformasining barcha xizmatlariga tatbiq etiladi.
      </p>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            <ul className="space-y-2">
              {s.body.map((p, i) => (
                <li key={i} className="text-xs sm:text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0 mt-1.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
