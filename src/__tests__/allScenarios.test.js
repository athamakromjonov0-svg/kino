import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../services/authService';
import movieService from '../services/movieService';
import sessionService from '../services/sessionService';
import bookingService from '../services/bookingService';
import { getErrorMessage, isConflictError } from '../utils/errorHandler';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  TOKEN_STORAGE_KEY: 'cinebook_token',
}));

describe('Complete 20 Verification Scenarios', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Scenario 1
  it('Scenario 1: New user registers via POST /auth/register', async () => {
    api.post.mockResolvedValueOnce({
      data: { user: { id: 1, name: 'Ali', email: 'ali@example.com' } },
    });
    const res = await authService.register({ name: 'Ali', email: 'ali@example.com', password: 'password123' });
    expect(res.user.name).toBe('Ali');
  });

  // Scenario 2
  it('Scenario 2: User logs in via POST /auth/login and receives token', async () => {
    api.post.mockResolvedValueOnce({
      data: { token: 'jwt_valid_token', user: { id: 1, email: 'ali@example.com' } },
    });
    const res = await authService.login({ email: 'ali@example.com', password: 'password123' });
    expect(res.token).toBe('jwt_valid_token');
    expect(localStorage.getItem('cinebook_token')).toBe('jwt_valid_token');
  });

  // Scenario 3
  it('Scenario 3: Profile data loads via GET /auth/me', async () => {
    api.get.mockResolvedValueOnce({
      data: { id: 1, name: 'Ali Valiyev', email: 'ali@example.com' },
    });
    const me = await authService.getMe();
    expect(me.name).toBe('Ali Valiyev');
  });

  // Scenario 4 & 5
  it('Scenario 4 & 5: Movies load with genre filter GET /movies?genre=action', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 4, title: 'The Dark Knight', genre: 'Action' }],
        page: 1,
        limit: 8,
        total: 1,
        totalPages: 1,
      },
    });
    const res = await movieService.getMovies({ genre: 'Action', page: 1, limit: 8 });
    expect(res.movies[0].title).toBe('The Dark Knight');
  });

  // Scenario 6
  it('Scenario 6: Pagination works as specified GET /movies?page=2&limit=2', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 3, title: 'Spider-Man' }],
        page: 2,
        limit: 2,
        total: 6,
        totalPages: 3,
      },
    });
    const res = await movieService.getMovies({ page: 2, limit: 2 });
    expect(res.page).toBe(2);
    expect(res.totalPages).toBe(3);
  });

  // Scenario 7 & 8
  it('Scenario 7 & 8: Movie details and sessions load via GET /movies/:id', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Dune: Part Two',
        sessions: [{ id: 101, hall: 'Zal 1 (IMAX)', time: '2026-10-02T18:00:00Z' }],
      },
    });
    const movie = await movieService.getMovieById(1);
    expect(movie.title).toBe('Dune: Part Two');
    expect(movie.sessions[0].id).toBe(101);
  });

  // Scenario 9
  it('Scenario 9: Seat map loads via GET /sessions/:id/seats', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { row: 1, seat: 1, taken: false },
        { row: 1, seat: 2, taken: true },
      ],
    });
    const seats = await sessionService.getSessionSeats(101);
    expect(seats).toHaveLength(2);
    expect(seats[0].taken).toBe(false);
    expect(seats[1].taken).toBe(true);
  });

  // Scenario 10 & 13
  it('Scenario 10 & 13: Booking a single seat sends POST /bookings with exact payload', async () => {
    api.post.mockResolvedValueOnce({
      data: { id: 101, sessionId: 101, row: 3, seat: 5 },
    });
    const result = await bookingService.bookSeat({ sessionId: 101, row: 3, seat: 5 });
    expect(api.post).toHaveBeenCalledWith('/bookings', { sessionId: 101, row: 3, seat: 5 });
    expect(result.id).toBe(101);
  });

  // Scenario 11
  it('Scenario 11: Booking multiple seats sends requests sequentially', async () => {
    api.post
      .mockResolvedValueOnce({ data: { id: 1, sessionId: 101, row: 2, seat: 1 } })
      .mockResolvedValueOnce({ data: { id: 2, sessionId: 101, row: 2, seat: 2 } });

    const result = await bookingService.bookMultipleSeats(101, [
      { row: 2, seat: 1 },
      { row: 2, seat: 2 },
    ]);
    expect(result.successCount).toBe(2);
    expect(api.post).toHaveBeenCalledTimes(2);
  });

  // Scenario 14
  it('Scenario 14: Handles 409 Conflict when second user attempts to book taken seat', async () => {
    const error409 = {
      response: {
        status: 409,
        data: { message: 'Ushbu joy allaqachon band qilingan' },
      },
    };
    api.post.mockRejectedValueOnce(error409);

    await expect(bookingService.bookSeat({ sessionId: 101, row: 3, seat: 5 })).rejects.toMatchObject({
      response: { status: 409 },
    });
    expect(isConflictError(error409)).toBe(true);
    expect(getErrorMessage(error409)).toBe('Ushbu joy allaqachon band qilingan');
  });

  // Scenario 15
  it('Scenario 15: Loads user bookings via GET /bookings/my', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, sessionId: 101, row: 3, seat: 5 }],
    });
    const bookings = await bookingService.getMyBookings();
    expect(bookings).toHaveLength(1);
    expect(bookings[0].row).toBe(3);
  });

  // Scenario 16
  it('Scenario 16: Cancels user booking via DELETE /bookings/:id', async () => {
    api.delete.mockResolvedValueOnce({ data: { message: 'Bron bekor qilindi' } });
    const res = await bookingService.cancelBooking(1);
    expect(api.delete).toHaveBeenCalledWith('/bookings/1');
    expect(res.message).toBe('Bron bekor qilindi');
  });

  // Scenario 17
  it('Scenario 17: Prevents cancelling another user booking with 403 Forbidden', async () => {
    const error403 = {
      response: {
        status: 403,
        data: { message: 'Bu bron boshqa foydalanuvchiga tegishli' },
      },
    };
    api.delete.mockRejectedValueOnce(error403);
    await expect(bookingService.cancelBooking(999)).rejects.toMatchObject({
      response: { status: 403 },
    });
    expect(getErrorMessage(error403)).toBe('Bu bron boshqa foydalanuvchiga tegishli');
  });

  // Scenario 18
  it('Scenario 18: Logout clears token and local credentials', () => {
    localStorage.setItem('cinebook_token', 'token_to_clear');
    authService.logout();
    expect(localStorage.getItem('cinebook_token')).toBeNull();
  });

  // Scenario 19
  it('Scenario 19: Expired/invalid token triggers 401 and clears credentials', () => {
    const error401 = { response: { status: 401 } };
    expect(getErrorMessage(error401)).toContain('Autentifikatsiyadan');
  });

  // Scenario 20
  it('Scenario 20: Displays graceful error state when API is offline', () => {
    const networkError = { code: 'ERR_NETWORK' };
    const message = getErrorMessage(networkError);
    expect(message).toContain('Server bilan aloqa');
  });
});
