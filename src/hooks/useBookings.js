import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';
import { getErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (bookingId) => {
    setCancelingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success("Bron muvaffaqiyatli bekor qilindi!");
      // Refresh list
      await fetchBookings();
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setCancelingId(null);
    }
  };

  return {
    bookings,
    isLoading,
    error,
    cancelingId,
    cancelBooking,
    refetch: fetchBookings,
  };
};

export default useBookings;
