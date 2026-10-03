import { useState, useEffect, useCallback } from 'react';
import movieService from '../services/movieService';
import { getErrorMessage } from '../utils/errorHandler';

export const useMovies = (initialParams = { genre: 'all', page: 1, limit: 8 }) => {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState(initialParams.genre || 'all');
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovies({ genre, page, limit });
      setMovies(data.movies || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      // ensure page is valid
      if (data.page && data.page !== page) {
        setPage(data.page);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [genre, page, limit]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // When changing genre, reset page to 1
  const changeGenre = (newGenre) => {
    setGenre(newGenre);
    setPage(1);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    movies,
    genre,
    page,
    limit,
    total,
    totalPages,
    isLoading,
    error,
    changeGenre,
    changePage,
    setLimit,
    refetch: fetchMovies,
  };
};

export default useMovies;
