import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Ticket, Play, Bookmark, User } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

const FAQS = [
  {
    q: 'Qanday chipta bron qilaman?',
    a: 'Filmlar katalogidan filmni tanlang, mavjud seanslardan birini bosning va zal xaritasidan joy tanlang. Bir bron uchun maksimal 4 tagacha joy tanlash mumkin. Tizimga kirgan holda bronni tasdiqlang — chipta «Mening bronlarim» bo\'limida saqlanadi.',
  },
  {
    q: 'Bronni bekor qilsam bo\'ladimi?',
    a: 'Ha. «Mening bronlarim» sahifasida har bir bronda «Bekor qilish» tugmasi bor. Bekor qilganda joy darhol boshqa foydalanuvchilar uchun bo\'shaydi.',
  },
  {
    q: 'Filmlarni onlayn ko\'rsam bo\'ladimi?',
    a: 'Ba\'zi filmlar uchun qonuniy video manbalar ulangan (masalan, ommaviy demo oqimlar yoki rasmiy treyler embedlari). Agar film uchun manba mavjud bo\'lmasa, Watch sahifasida «Streaming mavjud emas» degan aniq holat ko\'rsatiladi — biz hech qachon ruxsatsiz nusxalarni ko\'rsatmaymiz.',
  },
  {
    q: 'Watchlist va Sevimlilar qayerda saqlanadi?',
    a: 'Bu ro\'yxatlar xavfsizlik uchun faqat sizning qurilmangizda (brauzer localStorage) saqlanadi. Backendda server-side ro\'yxatlar API hozircha mavjud emas, shuning uchun ular boshqa qurilmada ko\'rinmaydi.',
  },
  {
    q: 'Sayt qaysi tillarni qo\'llaydi?',
    a: 'O\'zbekcha, ruscha va inglizcha. Tilni «Sozlamalar» sahifasidan o\'zgartirishingiz mumkin.',
  },
  {
    q: 'Parolimni unutdim, nima qilaman?',
    a: 'Hozircha parolni tiklash xizmati ishlab chiqilmoqda. Ro\'yxatdan o\'tishda ishlatgan email va parolni qayta kiriting yoki qo\'llab-quvvatlash xizmatiga murojaat qiling.',
  },
];

const QUICK_LINKS = [
  { to: '/sessions', icon: Ticket, title: 'Seanslar', desc: 'Mavjud seanslarni ko\'rish' },
  { to: '/watch', icon: Play, title: 'Onlayn ko\'rish', desc: 'Qonuniy video manbalar' },
  { to: '/watchlist', icon: Bookmark, title: 'Watchlist', desc: 'Keyinroq ko\'rish ro\'yxati' },
  { to: '/profile', icon: User, title: 'Profil', desc: 'Shaxsiy ma\'lumotlar' },
];

export const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={HelpCircle}
        title="Yordam markazi"
        subtitle="Platformadan foydalanish bo'yicha qo'llanma va savol-javob"
      />

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="bg-[#18181F] border border-[#27272A] hover:border-[#E50914]/50 rounded-2xl p-4 space-y-2 transition-colors group"
          >
            <l.icon className="w-5 h-5 text-[#FF4D5A]" />
            <p className="text-xs font-bold text-white group-hover:text-[#FF4D5A] transition-colors">{l.title}</p>
            <p className="text-[11px] text-zinc-500 leading-snug">{l.desc}</p>
          </Link>
        ))}
      </div>

      {/* FAQ accordion */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Ko'p so'raladigan savollar</h2>
        {FAQS.map((f, i) => (
          <div
            key={i}
            className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#18181F]/50 transition-colors"
            >
              <span className="text-sm font-semibold text-white">{f.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-[#27272A] pt-4">
                  {f.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 text-center">
        <p className="text-xs text-zinc-400">
          Javob topa olmadingizmi?{' '}
          <Link to="/contact" className="text-[#FF4D5A] font-semibold hover:text-white transition-colors">
            Biz bilan bog'laning
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
