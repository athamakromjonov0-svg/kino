import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import archiveService from '../../services/archiveService';
import VideoPlayer from '../../components/streaming/VideoPlayer';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  ArrowLeft, Clapperboard, Calendar, User, Download, Scale, ExternalLink, Play,
} from 'lucide-react';

/**
 * /catalog/archive/:identifier — Internet Archive item page.
 *
 * Reuses the shared VideoPlayer with a source built from the item's own files
 * (MP4 / HLS). When the item ships no playable video we say so explicitly
 * instead of faking playback.
 */
export const ArchiveMovieDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [selectedUrl, setSelectedUrl] = useState(null);

  const { data: movie, isLoading, error, refetch } = useQuery({
    queryKey: ['archive-details', identifier],
    queryFn: () => archiveService.getDetails(identifier),
    retry: 1,
  });

  useEffect(() => {
    setSelectedUrl(null);
  }, [identifier]);

  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} — Cineora`;
    }
    return () => {
      document.title = 'Cineora';
    };
  }, [movie?.title]);

  const source = useMemo(() => {
    if (!movie?.source) return null;
    if (!selectedUrl || selectedUrl === movie.source.url) return movie.source;

    const file = (movie.files || []).find((f) => f.url === selectedUrl);
    if (!file) return movie.source;

    return {
      ...movie.source,
      url: file.url,
      type: file.name.endsWith('.m3u8') ? 'hls' : 'mp4',
      label: file.height ? `${file.height}p` : file.format || 'Video',
    };
  }, [movie, selectedUrl]);

  if (isLoading) {
    return <Loader fullScreen text="archive.org dan yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState
          title="archive.org ga ulanib bo'lmadi"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Clapperboard}
          title="Film topilmadi"
          description={`archive.org'da "${identifier}" identifikatorli topilmadi.`}
          actionText="Archive katalogga qaytish"
          onAction={() => navigate('/catalog/archive')}
        />
      </div>
    );
  }

  const meta = [
    movie.year ? { icon: Calendar, label: 'Yil', value: movie.year } : null,
    movie.creator ? { icon: User, label: 'Boshqaruvi', value: movie.creator } : null,
    movie.genre ? { icon: Clapperboard, label: 'Janr', value: movie.genre } : null,
    movie.downloads ? { icon: Download, label: 'Yuklab olishlar', value: movie.downloads.toLocaleString('en-US') } : null,
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <button
        type="button"
        onClick={() => navigate('/catalog/archive')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white p-2 rounded-lg bg-[#18181F] border border-[#27272A] transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Archive katalogga qaytish</span>
      </button>

      {source ? (
        <VideoPlayer source={source} movieTitle={movie.title} />
      ) : (
        <div className="relative w-full aspect-video rounded-2xl bg-[#121216] border border-[#27272A] overflow-hidden flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#18181F] border border-[#27272A] flex items-center justify-center">
            <Clapperboard className="w-8 h-8 text-zinc-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-bold text-white">Video fayl topilmadi</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Bu archive.org yozuvidan o'ynatiladigan video fayl topilmadi. Pastdagi
              tafsilotlardan foydalanib asl sahifani ochishingiz mumkin.
            </p>
          </div>
        </div>
      )}

      {/* Quality / format switcher when the item ships several video files */}
      {source && (movie.files || []).length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 font-semibold mr-1">Manba:</span>
          {movie.files.map((file) => {
            const active = file.url === source.url;
            return (
              <button
                key={file.url}
                type="button"
                onClick={() => setSelectedUrl(file.url)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                  active
                    ? 'bg-[#E50914] border-[#E50914] text-white'
                    : 'bg-[#18181F] border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500'
                }`}
              >
                {file.height ? `${file.height}p` : file.format || file.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-[#27272A] bg-[#18181F]">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-[#E50914]/90 text-[11px] font-semibold text-white">
                {movie.genre}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#18181F] border border-[#27272A] text-[11px] font-semibold text-zinc-300">
                Internet Archive
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {movie.title}
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">{movie.identifier}</p>
          </div>

          {meta.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {meta.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-[#18181F] border border-[#27272A] rounded-xl p-3 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{value}</p>
                </div>
              ))}
            </div>
          )}

          {movie.description && (
            <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-2">Tavsif</h2>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            </div>
          )}

          <div className="bg-[#18181F] border border-[#27272A] rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-2 text-xs text-zinc-400">
              <Scale className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold text-white">License: </span>
                {movie.license || "Internet Archive ochiq kutubxonasi — faqat qonuniy manbalar"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={movie.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                archive.org'da ochish
              </a>
              <Link
                to="/catalog/archive"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-semibold transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Bosh filmlar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveMovieDetailsPage;
