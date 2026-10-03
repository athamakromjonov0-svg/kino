import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Ticket, Film, Clock, MapPin, Sofa } from 'lucide-react';
import bookingService from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatDate';

/**
 * BookingSuccessPage — shows ONLY backend-confirmed booking data.
 * The last confirmed booking is passed via router state from SeatBooking,
 * or the newest booking is fetched from GET /bookings/my as fallback.
 * Never fabricates booking details.
 */
export const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  const stateBooking = location.state?.booking || null;

  useEffect(() => {
    let mounted = true;

    if (stateBooking) {
      setBooking(stateBooking);
      setIsLoading(false);
      return undefined;
    }

    // Fallback: fetch newest confirmed booking
    bookingService
      .getMyBookings()
      .then((list) => {
        if (!mounted) return;
        const sorted = (Array.isArray(list) ? list : []).sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setBooking(sorted[0] || null);
      })
      .catch(() => {
        if (mounted) setBooking(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [stateBooking]);

  if (isLoading) {
    return <Loader fullScreen text="Bron ma'lumotlari yuklanmoqda..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Ticket}
          title="Bron topilmadi"
          description="Tasdiqlangan bron mavjud emas. Bronlar tarixini tekshirib ko'ring."
          actionText="Mening bronlarim"
          onAction={() => navigate('/my-bookings')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-8">
      {/* Success header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#22C55E]/[0.14] border border-[#22C55E]/[0.28] flex items-center justify-center shadow-2xl shadow-[#22C55E]/[0.08]">
          <CheckCircle2 className="w-10 h-10 text-[#34D399]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Bron muvaffaqiyatli tasdiqlandi!
        </h1>
        <p className="text-xs text-[#9CA3AF]">
          Chiptangiz shaxsiy kabinetingizda saqlandi. Kinoteatrga kirishda ko'rsatishingiz mumkin.
        </p>
      </div>

      {/* Ticket card */}
      <div className="bg-[#101218] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-transparent px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A78BFA]">
              E-chipta
            </span>
            <span className="text-xs font-mono font-bold text-[#F8FAFC] bg-black/30 px-2.5 py-1 rounded-md border border-white/10">
              #{booking.id}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                Bron raqami
              </p>
              <p className="text-sm font-bold text-[#F8FAFC]">#{booking.id}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Sana
              </p>
              <p className="text-sm font-bold text-[#F8FAFC]">
                {booking.createdAt ? formatDateTime(booking.createdAt) : '—'}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                Seans
              </p>
              <p className="text-sm font-bold text-[#F8FAFC]">#{booking.sessionId}</p>
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

          <div className="border-t border-dashed border-white/[0.08] pt-5">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#6B7280] font-bold flex items-center gap-1.5 mb-2">
              <Sofa className="w-3.5 h-3.5" />
              Joy
            </p>
            <p className="text-2xl font-extrabold text-[#A78BFA]">
              Qator {booking.row} • Joy {booking.seat}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/my-bookings"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-sm font-bold transition-colors"
        >
          <Ticket className="w-4 h-4" />
          Mening bronlarim
        </Link>
        <Link
          to="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-[#E5E7EB] hover:text-[#F8FAFC] text-sm font-semibold transition-colors"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
