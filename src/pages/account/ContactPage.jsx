import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, MessageSquare, Info, HelpCircle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

/**
 * ContactPage — the backend has NO contact-message endpoint yet, so this page
 * does NOT fake "message sent". It shows real support channels instead and
 * clearly marks the form as a backend extension (documented in README).
 */
export const ContactPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={MessageSquare}
        title="Bog'lanish"
        subtitle="Savollaringiz va takliflaringiz bilan murojaat qiling"
      />

      {/* Honest notice */}
      <div className="flex items-start gap-3 bg-[#121216] border border-amber-500/30 rounded-2xl p-4">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Onlayn aloqa formasi hozircha <span className="text-white font-semibold">backend endpointiga ulanmagan</span>
          (POST /contact backend kengaytmasi sifatida README'da hujjatlashtirilgan).
          Xabar yuborilgandek soxta tasdiq ko'rsatmaymiz — quyidagi kanallar orqali murojaat qiling.
        </p>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF4D5A]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Email</h3>
          <p className="text-xs text-zinc-400">support@cineora.uz</p>
          <p className="text-[11px] text-zinc-500">24 soat ichida javob beramiz</p>
        </div>

        <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Telefon</h3>
          <p className="text-xs text-zinc-400">+998 (71) 200-00-00</p>
          <p className="text-[11px] text-zinc-500">Dushanba–Shanba, 9:00–18:00</p>
        </div>

        <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Ofis</h3>
          <p className="text-xs text-zinc-400">Toshkent, Amir Temur shoh ko'chasi 108</p>
          <p className="text-[11px] text-zinc-500">Dushanba–Juma</p>
        </div>
      </div>

      {/* FAQ pointer */}
      <div className="bg-gradient-to-r from-[#18181F] to-[#121216] border border-[#27272A] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-[#FF4D5A]" />
          <div>
            <h3 className="text-sm font-bold text-white">Tez javop kerakmi?</h3>
            <p className="text-xs text-zinc-400">Yordam markazida ko'p so'raladigan savollarga javoblar bor.</p>
          </div>
        </div>
        <Link
          to="/help"
          className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors shrink-0"
        >
          Yordam markazi
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
