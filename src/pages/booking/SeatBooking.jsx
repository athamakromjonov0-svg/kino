import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionService from '../../services/sessionService';
import bookingService from '../../services/bookingService';
import movieService from '../../services/movieService';
import SeatMap from '../../components/booking/SeatMap';
import BookingSummary from '../../components/booking/BookingSummary';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage, isConflictError } from '../../utils/errorHandler';
import { ArrowLeft, Ticket, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const SeatBooking = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [movieInfo, setMovieInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(null);

  // Fetch seats map from GET /sessions/:id/seats
  const loadSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const seatsData = await sessionService.getSessionSeats(sessionId);
      setSeats(seatsData);

      // Attempt to find session details and movie details across movies
      try {
        const { movies } = await movieService.getMovies({ limit: 50 });
        for (const m of movies) {
          if (m.sessions && Array.isArray(m.sessions)) {
            const foundSession = m.sessions.find(
              (s) => String(s.id || s._id) === String(sessionId)
            );
            if (foundSession) {
              setSessionInfo(foundSession);
              setMovieInfo(m);
              break;
            }
          }
        }
      } catch (e) {
        // Safe fallback if movie details search fails
      }

      // If session info wasn't found in list, setup clean minimal placeholder
      setSessionInfo((prev) => prev || { id: sessionId, hall: `Zal #${sessionId}` });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  /**
   * Handle sequential multiple seats booking
   */
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Iltimos, avval joy tanlang!");
      return;
    }

    setIsSubmitting(true);
    const totalToBook = selectedSeats.length;
    const successful = [];
    const failed = [];

    for (let i = 0; i < selectedSeats.length; i++) {
      const s = selectedSeats[i];
      setBookingProgress({ current: i + 1, total: totalToBook });

      try {
        await bookingService.bookSeat({
          sessionId,
          row: s.row,
          seat: s.seat,
        });
        successful.push(s);
      } catch (err) {
        const msg = getErrorMessage(err);
        failed.push({ seat: s, message: msg, error: err });
      }
    }

    setBookingProgress(null);
    setIsSubmitting(false);

    // Refresh seat map immediately
    await loadSeats();

    // Remove successfully booked seats from current selection so user doesn't resubmit them
    const remainingSelected = selectedSeats.filter(
      (s) => !successful.some((suc) => suc.row === s.row && suc.seat === s.seat)
    );
    setSelectedSeats(remainingSelected);

    // Analyze results
    if (failed.length === 0) {
      // 100% success
      toast.success(`${successful.length} ta joy muvaffaqiyatli band qilindi!`);
      navigate('/my-bookings');
    } else if (successful.length === 0) {
      // 100% failure
      if (failed.some(f => isConflictError(f.error))) {
        toast.error("Tanlangan joy allaqachon boshqa foydalanuvchi tomonidan band qilingan (409 xatosi)!");
      } else {
        toast.error(`Bron qilishda xatolik: ${failed[0].message}`);
      }
    } else {
      // Partial success
      toast.success(`${successful.length} ta joy band qilindi.`);
      toast.error(
        `${failed.length} ta joyni band qilib bo'lmadi (Joy band bo'lishi mumkin).`
      );
    }
  };

  if (isLoading) {
    return <Loader fullScreen text="Zal va joylar xaritasi yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="Zal ma'lumotlarini yuklab bo'lmadi"
          message={error}
          onRetry={loadSeats}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-[#18181F] hover:bg-[#27272A] border border-[#27272A] text-zinc-400 hover:text-white transition-colors"
            aria-label="Ortga"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#E50914]" />
              <span>Joy Tanlash & Bron</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Seans ID: #{sessionId} {movieInfo?.title ? `— ${movieInfo.title}` : ''}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Zal Rejimi</span>
        </div>
      </div>

      {/* Main Booking Interface: Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Interactive Seat Map (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatSelect={setSelectedSeats}
            maxSeats={4}
          />
        </div>

        {/* Right Col: Booking Summary & Confirmation (4 cols on lg) */}
        <div className="lg:col-span-4 sticky top-24">
          <BookingSummary
            movie={movieInfo}
            session={sessionInfo}
            selectedSeats={selectedSeats}
            onConfirmBooking={handleConfirmBooking}
            isSubmitting={isSubmitting}
            bookingProgress={bookingProgress}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
