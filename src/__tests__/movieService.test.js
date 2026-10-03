import { describe, it, expect, beforeEach, vi } from 'vitest';
import movieService from '../services/movieService';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('movieService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Scenario 4 & 5: Fetches movies with genre filter and pagination', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, title: 'Dune: Part Two', genre: 'Sci-Fi' },
          { id: 2, title: 'Oppenheimer', genre: 'Drama' },
        ],
        page: 1,
        limit: 2,
        total: 5,
        totalPages: 3,
      },
    };
    api.get.mockResolvedValueOnce(mockResponse);

    const result = await movieService.getMovies({ genre: 'action', page: 1, limit: 2 });

    expect(api.get).toHaveBeenCalledWith('/movies', {
      params: { genre: 'action', page: 1, limit: 2 },
    });
    expect(result.movies).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(3);
  });

  it('Scenario 6: Pagination handles array fallback if backend returns flat list', async () => {
    const mockArray = [
      { id: 1, title: 'Movie 1' },
      { id: 2, title: 'Movie 2' },
      { id: 3, title: 'Movie 3' },
    ];
    api.get.mockResolvedValueOnce({ data: mockArray });

    const result = await movieService.getMovies({ page: 1, limit: 2 });
    expect(result.movies).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(2);
  });

  it('Scenario 7 & 8: Fetches single movie with sessions via GET /movies/:id', async () => {
    const mockMovie = {
      id: 1,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi',
      sessions: [
        { id: 101, hall: 'Zal 1 (IMAX)', time: '2026-10-02T18:00:00Z' },
      ],
    };
    api.get.mockResolvedValueOnce({ data: mockMovie });

    const result = await movieService.getMovieById(1);
    expect(api.get).toHaveBeenCalledWith('/movies/1');
    expect(result.id).toBe(1);
    expect(result.sessions).toHaveLength(1);
  });
});
