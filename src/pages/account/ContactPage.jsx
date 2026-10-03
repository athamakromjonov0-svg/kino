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
      <div className="flex items-start gap-3 bg-[#101218] border border-[#F59E0B]/[0.3] rounded-2xl p-4">
        <Info className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          Onlayn aloqa formasi hozircha <span className="text-[#F8FAFC] font-semibold">backend endpointiga ulanmagan</span>
          (POST /contact backend kengaytmasi sifatida README'da hujjatlashtirilgan).
          Xabar yuborilgandek soxta tasdiq ko'rsatmaymiz — quyidagi kanallar orqali murojaat qiling.
        </p>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC]">Email</h3>
          <p className="text-xs text-[#9CA3AF]">support@cineora.uz</p>
          <p className="text-[11px] text-[#6B7280]">24 soat ichida javob beramiz</p>
        </div>

        <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/[0.14] border border-[#22C55E]/[0.28] flex items-center justify-center text-[#34D399]">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC]">Telefon</h3>
          <p className="text-xs text-[#9CA3AF]">+998 (71) 200-00-00</p>
          <p className="text-[11px] text-[#6B7280]">Dushanba–Shanba, 9:00–18:00</p>
        </div>

        <div className="bg-[#171A22] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/[0.12] border border-[#F59E0B]/[0.3] flex items-center justify-center text-[#FBBF24]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC]">Ofis</h3>
          <p className="text-xs text-[#9CA3AF]">Toshkent, Amir Temur shoh ko'chasi 108</p>
          <p className="text-[11px] text-[#6B7280]">Dushanba–Juma</p>
        </div>
      </div>

      {/* FAQ pointer */}
      <div className="bg-gradient-to-r from-[#171A22] to-[#101218] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-[#A78BFA]" />
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Tez javop kerakmi?</h3>
            <p className="text-xs text-[#9CA3AF]">Yordam markazida ko'p so'raladigan savollarga javoblar bor.</p>
          </div>
        </div>
        <Link
          to="/help"
          className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-xs font-bold transition-colors shrink-0"
        >
          Yordam markazi
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
