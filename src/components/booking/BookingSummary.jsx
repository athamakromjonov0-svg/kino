import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/formatDate';

export const BookingSummary = ({
  movie,
  session,
  selectedSeats = [],
  onConfirmBooking,
  isSubmitting = false,
  bookingProgress = null,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const movieTitle = movie?.title || movie?.name || "Film nomi";
  const hallName = session?.hall || session?.room || session?.auditorium || `Zal #${session?.hallId || session?.id || 1}`;
  const sessionTime = session?.time || session?.date || session?.startTime;

  // Check if price exists in backend session or movie
  const hasPrice = typeof session?.price === 'number' || typeof movie?.price === 'number';
  const unitPrice = session?.price || movie?.price || 0;
  const totalPrice = hasPrice ? unitPrice * selectedSeats.length : null;

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    onConfirmBooking();
  };

  return (
    <div className="w-full bg-[#18181F] border border-[#27272A] rounded-2xl p-6 flex flex-col space-y-5 shadow-2xl">
      <div className="border-b border-[#27272A] pb-4">
        <h3 className="text-lg font-bold text-white tracking-wide">
          Buyurtma Ma'lumotlari
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Tanlangan chiptalarni tasdiqlang
        </p>
      </div>

      {/* Film and Session info */}
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          {movie?.poster && (
            <img
              src={movie.poster}
              alt={movieTitle}
              className="w-12 h-16 object-cover rounded-lg border border-[#27272A] flex-shrink-0"
            />
          )}
          <div>
            <h4 className="font-bold text-white text-base leading-snug line-clamp-2">
              {movieTitle}
            </h4>
            {movie?.genre && (
              <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-[#E50914]/20 text-[#FF4D5A] font-semibold border border-[#E50914]/30">
                {movie.genre}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#27272A]/70 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#FF4D5A]" />
            <span className="text-zinc-400">Zal:</span>
            <span className="font-semibold text-white ml-auto">{hallName}</span>
          </div>

          {sessionTime && (
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-400">Vaqti:</span>
              <span className="font-semibold text-white ml-auto">{formatDateTime(sessionTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Seats Details */}
      <div className="bg-[#121216] rounded-xl p-4 border border-[#27272A] space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">Tanlangan joylar soni:</span>
          <span className="font-bold text-white bg-[#27272A] px-2 py-0.5 rounded text-xs">
            {selectedSeats.length} / 4 ta
          </span>
        </div>

        {selectedSeats.length > 0 ? (
          <div className="pt-2 border-t border-[#27272A]/60 flex flex-wrap gap-1.5">
            {selectedSeats.map((s) => (
              <span
                key={`${s.row}-${s.seat}`}
                className="px-2.5 py-1 rounded-md bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF4D5A] text-xs font-mono font-bold"
              >
                Qator {s.row}, Joy {s.seat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic pt-1">
            Zal xaritasidan joylarni tanlang (maksimum 4 ta)
          </p>
        )}

        {/* Display price ONLY if provided by backend */}
        {hasPrice && selectedSeats.length > 0 && (
          <div className="pt-3 border-t border-[#27272A] flex justify-between items-center text-sm font-semibold">
            <span className="text-zinc-300">Jami narx:</span>
            <span className="text-[#FF4D5A] text-base font-bold">
              {totalPrice.toLocaleString()} UZS
            </span>
          </div>
        )}
      </div>

      {/* Booking progress display if currently booking multiple seats */}
      {bookingProgress && (
        <div className="bg-[#121216] p-3 rounded-xl border border-zinc-800 text-xs space-y-1">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span>Bron qilinmoqda: {bookingProgress.current} / {bookingProgress.total}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full glow-red"
          disabled={selectedSeats.length === 0 || isSubmitting}
          isLoading={isSubmitting}
          icon={Ticket}
          onClick={handleAction}
        >
          {!isAuthenticated
            ? "Bron qilish uchun kiring"
            : selectedSeats.length === 0
            ? "Joy tanlang"
            : `Bron qilish (${selectedSeats.length} ta joy)`}
        </Button>
      </div>

      <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
        * Bron qilingan chiptalar darhol tizimda ro'yxatga olinadi va shaxsiy kabinetda saqlanadi.
      </p>
    </div>
  );
};

export default BookingSummary;
