import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookings from '../../hooks/useBookings';
import Sidebar from '../../components/layout/Sidebar';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { Ticket, Trash2, AlertTriangle, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

export const MyBookings = () => {
  const { bookings, isLoading, error, cancelingId, cancelBooking, refetch } = useBookings();
  const navigate = useNavigate();

  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsModalOpen(true);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
    setIsModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    const id = bookingToCancel.id || bookingToCancel._id;
    const res = await cancelBooking(id);
    if (res.success) {
      closeCancelModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-3">
          <Ticket className="w-8 h-8 text-[#8B5CF6]" />
          <span>Mening Chiptalarim & Bronlarim</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
          Siz tomoningizdan band qilingan barcha kino seanslari va joylar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <Sidebar />
        </div>

        {/* Right Main Bookings List */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-[#171A22] rounded-2xl animate-pulse border border-white/[0.08]"
                />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Bronlarni yuklab bo'lmadi"
              message={error}
              onRetry={refetch}
            />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="Sizda hali bron qilingan chiptalar yo'q"
              description="Katalogdan o'zingiz yoqtirgan filmni tanlang va eng qulay joylarni band qiling!"
              actionText="Filmlar katalogiga o'tish"
              onAction={() => navigate('/movies')}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF] px-1">
                <span>Jami bronlar soni: {bookings.length} ta</span>
              </div>

              {bookings.map((b) => {
                const bookingId = b.id || b._id;
                const sessionId = b.sessionId || b.session_id;
                const row = b.row;
                const seat = b.seat;
                const status = b.status || "Tasdiqlangan";
                const isCurrentlyCanceling = cancelingId === bookingId;

                return (
                  <div
                    key={bookingId}
                    className="bg-[#171A22] border border-white/[0.08] hover:border-[#8B5CF6]/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all shadow-lg"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs font-mono font-bold">
                          Bron ID: #{bookingId}
                        </span>

                        <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-[#D1D5DB] text-xs font-mono font-semibold">
                          Seans ID: #{sessionId}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/[0.10] border border-[#22C55E]/[0.22] text-[#34D399] text-[11px] font-semibold">
                          {status}
                        </span>
                      </div>

                      {/* Seat details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#F8FAFC] pt-1">
                        <div className="flex items-center gap-2 bg-[#101218] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                          <span className="text-[#9CA3AF] text-xs font-normal">Qator:</span>
                          <span className="text-[#A78BFA] font-mono text-base">{row}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#101218] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                          <span className="text-[#9CA3AF] text-xs font-normal">Joy:</span>
                          <span className="text-[#A78BFA] font-mono text-base">{seat}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cancel action */}
                    <div>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        isLoading={isCurrentlyCanceling}
                        onClick={() => openCancelModal(b)}
                        className="w-full sm:w-auto"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeCancelModal}
        title="Bronni bekor qilish"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <p className="text-sm text-[#D1D5DB] text-center leading-relaxed">
            Haqiqatan ham ushbu bronni bekor qilmoqchimisiz?
            {bookingToCancel && (
              <span className="block mt-2 font-mono font-bold text-[#F8FAFC]">
                Bron ID: #{bookingToCancel.id || bookingToCancel._id} (Qator {bookingToCancel.row}, Joy {bookingToCancel.seat})
              </span>
            )}
          </p>

          <p className="text-xs text-[#6B7280] text-center">
            Bekor qilingan chipta qayta tiklanmaydi va ushbu joy boshqa tomoshabinlar uchun ochiladi.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <Button
              variant="secondary"
              size="md"
              onClick={closeCancelModal}
              disabled={cancelingId !== null}
            >
              Yo'q, qolsin
            </Button>

            <Button
              variant="danger"
              size="md"
              icon={Trash2}
              isLoading={cancelingId !== null}
              onClick={handleConfirmCancel}
            >
              Ha, bekor qilish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
