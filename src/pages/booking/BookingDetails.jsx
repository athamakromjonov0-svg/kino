import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Ticket, Film, Clock, MapPin, Sofa, Trash2, AlertTriangle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useBookings } from '../../hooks/useBookings';
import { formatDateTime } from '../../utils/formatDate';

/**
 * BookingDetailsPage — full info about one booking with cancel option.
 */
export const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, isLoading, error, cancelBooking, cancelingId, refetch } = useBookings();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const booking = bookings.find((b) => String(b.id) === String(id));

  if (isLoading) {
    return <Loader fullScreen text="Bron yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState title="Bronni yuklab bo'lmadi" message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Ticket}
          title="Bron topilmadi"
          description={`ID: #${id} bron mavjud emas yoki sizga tegishli emas.`}
          actionText="Mening bronlarim"
          onAction={() => navigate('/my-bookings')}
        />
      </div>
    );
  }

  const isPast = booking.createdAt && new Date(booking.createdAt) < new Date(Date.now() - 86400000);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <button
        type="button"
        onClick={() => navigate('/my-bookings')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#F8FAFC] p-2 rounded-lg bg-[#171A22] border border-white/[0.08] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Mening bronlarim</span>
      </button>

      <div className="bg-[#101218] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-transparent px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A78BFA]">Bron tafsilotlari</span>
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
              isPast
                ? 'bg-white/[0.06] border border-white/[0.14]/30 text-[#D1D5DB]'
                : 'bg-[#22C55E]/[0.14] border border-[#22C55E]/[0.28] text-[#34D399]'
            }`}
          >
            {isPast ? 'O\'tgan' : booking.status || 'Tasdiqlangan'}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                Bron raqami
              </p>
              <p className="text-base font-bold text-[#F8FAFC]">#{booking.id}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Seans
              </p>
              <p className="text-base font-bold text-[#F8FAFC]">#{booking.sessionId}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Bron vaqti
              </p>
              <p className="text-sm font-bold text-[#F8FAFC]">
                {booking.createdAt ? formatDateTime(booking.createdAt) : '—'}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Zal
              </p>
              <p className="text-sm font-bold text-[#F8FAFC]">
                {booking.hall || booking.sessionInfo?.hall || 'Zal xaritasida ko\'rsatilgan'}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-white/[0.08] pt-6">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5 mb-2">
              <Sofa className="w-3.5 h-3.5" />
              Joy
            </p>
            <p className="text-2xl font-extrabold text-[#A78BFA]">
              Qator {booking.row} • Joy {booking.seat}
            </p>
          </div>

          {!isPast && (
            <div className="border-t border-white/[0.08] pt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-[#9CA3AF]">Rejalar o'zgarishi bo'lsa bronni bekor qilishingiz mumkin.</p>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:text-red-300 text-xs font-bold transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Bekor qilish
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Bronni bekor qilasizmi?</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                #{booking.id} bron — Qator {booking.row}, Joy {booking.seat}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Bu amalni qaytarib bo'lmayadi. Joy darhol boshqa foydalanuvchilar uchun bo'shaydi.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                const result = await cancelBooking(booking.id);
                setIsCancelModalOpen(false);
                if (result.success) {
                  navigate('/my-bookings');
                }
              }}
              disabled={cancelingId === booking.id}
            >
              {cancelingId === booking.id ? 'Bekor qilinmoqda...' : 'Ha, bekor qilish'}
            </Button>
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-[#D1D5DB] hover:text-[#F8FAFC] text-sm font-semibold transition-colors"
            >
              Yo'q, qoldirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetails;
