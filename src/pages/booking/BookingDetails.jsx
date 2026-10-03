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
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Mening bronlarim</span>
      </button>

      <div className="bg-[#121216] border border-[#27272A] rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#E50914]/20 to-transparent px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D5A]">Bron tafsilotlari</span>
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
              isPast
                ? 'bg-zinc-500/15 border border-zinc-500/30 text-zinc-300'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isPast ? 'O\'tgan' : booking.status || 'Tasdiqlangan'}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                Bron raqami
              </p>
              <p className="text-base font-bold text-white">#{booking.id}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Seans
              </p>
              <p className="text-base font-bold text-white">#{booking.sessionId}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Bron vaqti
              </p>
              <p className="text-sm font-bold text-white">
                {booking.createdAt ? formatDateTime(booking.createdAt) : '—'}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Zal
              </p>
              <p className="text-sm font-bold text-white">
                {booking.hall || booking.sessionInfo?.hall || 'Zal xaritasida ko\'rsatilgan'}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-[#27272A] pt-6">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5 mb-2">
              <Sofa className="w-3.5 h-3.5" />
              Joy
            </p>
            <p className="text-2xl font-extrabold text-[#FF4D5A]">
              Qator {booking.row} • Joy {booking.seat}
            </p>
          </div>

          {!isPast && (
            <div className="border-t border-[#27272A] pt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-400">Rejalar o'zgarishi bo'lsa bronni bekor qilishingiz mumkin.</p>
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
              <AlertTriangle className="w-6 h-6 text-[#FF4D5A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bronni bekor qilasizmi?</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                #{booking.id} bron — Qator {booking.row}, Joy {booking.seat}
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
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
              className="px-5 py-2.5 rounded-xl bg-[#18181F] border border-[#27272A] text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
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
