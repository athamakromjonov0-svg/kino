import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import cinemaService from '../../services/cinemaService';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Building2, MapPin, DoorOpen, ArrowRight, Info } from 'lucide-react';

export const CinemasPage = () => {
  const navigate = useNavigate();

  const { data: cinemas, isLoading, error, refetch } = useQuery({
    queryKey: ['cinemas'],
    queryFn: () => cinemaService.getCinemas(),
  });

  if (isLoading) {
    return <Loader fullScreen text="Kinoteatrlar yuklanmoqda..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Building2}
        title="Kinoteatrlar"
        subtitle="Cineora hamkor kinoteatrlari katalogi (namoyish ma'lumotlari)"
      />

      {!error && cinemas && cinemas.length > 0 && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Bu ro'yxat ma'lumotnoma (reference) katalog hisoblanadi. Real vaqtda joy band qilish
            faqat seanslar orqali amalga oshiriladi.
          </span>
        </div>
      )}

      {error ? (
        <ErrorState
          title="Kinoteatrlarni yuklab bo'lmadi"
          message={error?.message || String(error)}
          onRetry={refetch}
        />
      ) : cinemas && cinemas.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Kinoteatrlar katalogi bo'sh"
          description="Backendda /cinemas endpointi hali ma'lumot qaytarmayotgan bo'lishi mumkin."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(cinemas || []).map((cinema) => {
            const id = cinema.id || cinema._id;
            return (
              <Link
                key={id}
                to={`/cinemas/${id}`}
                className="group bg-[#121216] border border-[#27272A] hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#E50914]/10 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] bg-zinc-900 overflow-hidden">
                  {cinema.image ? (
                    <img
                      src={cinema.image}
                      alt={cinema.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white group-hover:text-[#FF4D5A] transition-colors line-clamp-1">
                    {cinema.name}
                  </h3>

                  {cinema.address && (
                    <p className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#FF4D5A] flex-shrink-0 mt-0.5" />
                      <span>{cinema.address}</span>
                    </p>
                  )}

                  {cinema.halls && (
                    <p className="flex items-center gap-2 text-xs text-zinc-300">
                      <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{cinema.halls} ta zal</span>
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-[#27272A]">
                    <span className="text-xs font-semibold text-[#FF4D5A]">Batafsil</span>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CinemasPage;
