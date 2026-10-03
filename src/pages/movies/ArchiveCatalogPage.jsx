import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import archiveService from '../../services/archiveService';
import ArchiveMovieGrid from '../../components/movies/ArchiveMovieGrid';
import PageHeader from '../../components/common/PageHeader';
import { MovieGridSkeleton } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage } from '../../utils/errorHandler';
import { Clapperboard, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const PAGE_SIZE = 24;
const DEBOUNCE_MS = 450;

/**
 * /catalog/archive — Internet Archive film catalog.
 *
 * Data comes straight from archive.org's public, CORS-enabled search API, so
 * this page works even when the local backend / mock server is offline.
 * Query and page are mirrored into the URL so results stay shareable.
 */
export const ArchiveCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') || '';
  const urlPage = Math.max(1, Number(searchParams.get('page')) || 1);

  const [input, setInput] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [page, setPage] = useState(urlPage);

  // Debounced input → query (and reset to the first page on a new search)
  useEffect(() => {
    const next = input.trim();
    if (next === query) return undefined;
    const timer = setTimeout(() => setQuery(next), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input, query]);

  // Keep the URL in sync with the active search/page
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['archive-movies', query, page],
    queryFn: () => archiveService.search({ search: query, page, limit: PAGE_SIZE }),
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const movies = data?.movies || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const submitSearch = (e) => {
    e.preventDefault();
    setQuery(input.trim());
    setPage(1);
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Clapperboard}
        title="Archive Kinolar"
        subtitle={
          total
            ? `Internet Archive ochiq kutubxonasidan badiiy filmlar (jami ${total.toLocaleString('en-US')} ta)`
            : "Internet Archive ochiq kutubxonasidagi badiiy filmlar"
        }
        badge={
          <a
            href="https://archive.org/details/movies"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            archive.org
          </a>
        }
      />

      {/* Server-side search across title + description */}
      <form onSubmit={submitSearch} className="relative w-full sm:max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setPage(1);
          }}
          placeholder="Film nomi yoki tavsif bo'yicha qidirish..."
          className="w-full bg-[#18181F] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[#27272A] focus:border-[#E50914] focus:outline-none transition-colors"
          aria-label="Archive filmlarini qidirish"
        />
      </form>

      {isLoading ? (
        <MovieGridSkeleton count={8} />
      ) : error ? (
        <ErrorState
          title="archive.org ga ulanib bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-8">
          <ArchiveMovieGrid
            movies={movies}
            emptyTitle="Filmlar topilmadi"
            emptyDescription={
              query
                ? `"${query}" bo'yicha hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.`
                : "Hozircha archive.org javob bermayapti — birozdan so'ng qayta urinib ko'ring."
            }
          />

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-[#27272A]">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => goToPage(page - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Oldingi</span>
              </button>

              <div className="px-4 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300">
                {page} / {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages || isFetching}
                onClick={() => goToPage(page + 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181F] border border-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArchiveCatalogPage;
