import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import cinemaService from '../../services/cinemaService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Building2, MapPin, DoorOpen, ArrowLeft, Ticket, Info } from 'lucide-react';

export const CinemaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: cinema, isLoading, error, refetch } = useQuery({
    queryKey: ['cinema', id],
    queryFn: () => cinemaService.getCinemaById(id),
  });

  if (isLoading) {
    return <Loader fullScreen text="Kinoteatr ma'lumotlari yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Kinoteatr ma'lumotlarini yuklab bo'lmadi"
          message={error?.message || String(error)}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!cinema || (!cinema.id && !cinema._id)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Building2}
          title="Kinoteatr topilmadi"
          description={`ID: #${id} bo'lgan kinoteatr mavjud emas.`}
          actionText="Barcha kinoteatrlar"
          onAction={() => navigate('/cinemas')}
        />
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-8">
      {/* Banner */}
      <div className="relative w-full h-64 sm:h-80 bg-[#101218] overflow-hidden border-b border-white/[0.08]">
        {cinema.image && (
          <img
            src={cinema.image}
            alt={cinema.name}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-3">
          <button
            type="button"
            onClick={() => navigate('/cinemas')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D1D5DB] hover:text-[#F8FAFC] p-2 rounded-lg bg-black/50 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kinoteatrlar</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#8B5CF6]" />
            {cinema.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-[#101218] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          {cinema.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#A78BFA] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">
                  Manzil
                </h4>
                <p className="text-sm text-[#F8FAFC]">{cinema.address}</p>
              </div>
            </div>
          )}

          {cinema.halls && (
            <div className="flex items-start gap-3">
              <DoorOpen className="w-5 h-5 text-[#34D399] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">
                  Zallar
                </h4>
                <p className="text-sm text-[#F8FAFC]">{cinema.halls} ta zal mavjud</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#60A5FA] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">
                Ma'lumot
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Kinoteatr zallari haqida batafsil ma'lumot va jadval backend kengaytmasi orqali
                qo'shiladi. Hozircha seanslar film sahifalari orqali ko'rsatiladi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/movies')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-sm font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Filmlar va seanslarni ko'rish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaDetailsPage;
