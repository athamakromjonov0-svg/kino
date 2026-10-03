import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, RotateCcw,
  AlertTriangle, Loader2, PictureInPicture2, Keyboard,
} from 'lucide-react';
import { VIDEO_SOURCE_TYPES } from '../../constants';
import { useDiscoveryStore } from '../../store/useDiscoveryStore';
import useAuth from '../../hooks/useAuth';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

/**
 * VideoPlayer — only renders a real, lawful source passed from WatchPage.
 * Supports: HLS (hls.js), MP4 (native), official EMBED iframe.
 * For EMBED type the native controls are limited to what the provider allows.
 */
const VideoPlayer = ({ source, movieTitle }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const hideTimer = useRef(null);

  const { user } = useAuth();
  const progressStore = useDiscoveryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState(null);

  const isEmbed = source?.type === VIDEO_SOURCE_TYPES.EMBED;
  const progressKey = String(source?.movieId || movieTitle || 'video');

  // Resume: restore saved position on first load
  useEffect(() => {
    if (isEmbed || !videoRef.current) return;
    const saved = progressStore.getPlaybackProgress(progressKey);
    if (saved?.progress && saved.progress > 5) {
      videoRef.current.currentTime = saved.progress;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmbed]);

  // HLS setup / teardown
  useEffect(() => {
    if (!videoRef.current || !source) return;
    setError(null);

    if (source.type === VIDEO_SOURCE_TYPES.HLS) {
      const isNativeHls = videoRef.current.canPlayType('application/vnd.apple.mpegurl');
      if (isNativeHls) return; // Safari — native

      let cancelled = false;
      import('hls.js')
        .then(({ default: Hls }) => {
          if (cancelled || !videoRef.current) return;
          if (!Hls.isSupported()) {
            setError('Bu brauzer HLS formatni qo\'llab-quvvatlamaydi.');
            setIsLoading(false);
            return;
          }
          const hls = new Hls({ enableWorker: true });
          hlsRef.current = hls;
          hls.loadSource(source.url);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              setError(
                data.type === Hls.ErrorTypes.NETWORK_ERROR
                  ? 'Tarmoq xatosi: video oqim yuklanmadi. Internetni tekshirib, qayta urinib ko\'ring.'
                  : 'Video oqimini ijra etishda xatolik yuz berdi.'
              );
              setIsLoading(false);
            }
          });
        })
        .catch(() => {
          setError('Video pleyer modulini yuklab bo\'lmadi.');
          setIsLoading(false);
        });

      return () => {
        cancelled = true;
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }

    // MP4 — native playback, nothing to set up
    return undefined;
  }, [source]);

  // Save progress periodically (resume support) — only while playing
  useEffect(() => {
    if (isEmbed) return undefined;
    const interval = setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused && v.currentTime > 5) {
        progressStore.savePlaybackProgress(progressKey, Math.floor(v.currentTime), Math.floor(v.duration || 0));
      }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmbed, progressKey]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {
      /* PiP unsupported for this stream */
    }
  }, []);

  const seekBy = useCallback((delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min((v.duration || 0) - 1, v.currentTime + delta));
  }, []);

  const changeSpeed = (speed) => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  // Keyboard controls
  useEffect(() => {
    if (isEmbed) return undefined;
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k': e.preventDefault(); togglePlay(); break;
        case 'arrowright': e.preventDefault(); seekBy(10); break;
        case 'arrowleft': e.preventDefault(); seekBy(-10); break;
        case 'arrowup': {
          e.preventDefault();
          const v = videoRef.current;
          if (v) { v.volume = Math.min(1, v.volume + 0.1); setVolume(v.volume); }
          break;
        }
        case 'arrowdown': {
          e.preventDefault();
          const v = videoRef.current;
          if (v) { v.volume = Math.max(0, v.volume - 0.1); setVolume(v.volume); }
          break;
        }
        case 'm': toggleMute(); break;
        case 'f': toggleFullscreen(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEmbed, togglePlay, toggleMute, toggleFullscreen, seekBy]);

  // Fullscreen state sync
  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  const handleProgressClick = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const armControlsHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (containerRef.current) containerRef.current.style.cursor = 'default';
    hideTimer.current = setTimeout(() => {
      if (containerRef.current && isPlaying) containerRef.current.style.cursor = 'none';
    }, 2500);
  };

  // ============================================================
  // OFFICIAL EMBED (e.g. YouTube official trailer embed)
  // ============================================================
  if (isEmbed) {
    return (
      <div className="w-full space-y-3">
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
          <iframe
            src={source.url}
            title={movieTitle || source.label || 'Video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; full-screen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
          <span className="px-2.5 py-1 rounded-md bg-[#171A22] border border-white/[0.08] font-semibold text-[#D1D5DB]">
            {source.label || 'Official embed'}
          </span>
          <span>Litsenziya: {source.license || 'Official provider embed'}</span>
          {source.ageRating && (
            <span className="px-2 py-0.5 rounded bg-[#F59E0B]/[0.16] border border-[#F59E0B]/[0.3] text-[#FBBF24] font-bold">
              {source.ageRating}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // NATIVE PLAYER (HLS / MP4)
  // ============================================================
  return (
    <div className="w-full space-y-3">
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl group"
        onMouseMove={armControlsHide}
      >
        <video
          ref={videoRef}
          src={source?.type === VIDEO_SOURCE_TYPES.MP4 ? source.url : undefined}
          className="w-full h-full object-contain"
          playsInline
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => {
            setDuration(e.target.duration);
            setIsLoading(false);
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onVolumeChange={(e) => {
            setVolume(e.target.volume);
            setIsMuted(e.target.muted);
          }}
          onEnded={() => {
            progressStore.clearPlaybackProgress(progressKey);
          }}
          onError={() => {
            if (source?.type === VIDEO_SOURCE_TYPES.MP4) {
              setError('Video faylini yuklab bo\'lmadi. Manba mavjud emas yoki qo\'llab-quvvatlanmaydi.');
              setIsLoading(false);
            }
          }}
        />

        {/* Loading spinner */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-12 h-12 text-[#8B5CF6] animate-spin" />
          </div>
        )}

        {/* Explicit error state — never fake playback */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 px-6 text-center">
            <AlertTriangle className="w-12 h-12 text-[#A78BFA]" />
            <p className="text-sm font-semibold text-[#F8FAFC] max-w-md">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F8FAFC] text-xs font-bold transition-colors"
            >
              Qayta yuklash
            </button>
          </div>
        )}

        {/* Big center play button when paused */}
        {!isPlaying && !isLoading && !error && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group/play"
            aria-label="Ijro etish"
          >
            <span className="w-20 h-20 rounded-full bg-[#8B5CF6]/90 hover:bg-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#8B5CF6]/40 transition-all hover:scale-110">
              <Play className="w-9 h-9 text-[#F8FAFC] fill-white ml-1" />
            </span>
          </button>
        )}

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-3 pt-8 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
        >
          {/* Progress */}
          <div
            className="w-full h-1.5 bg-white/15 rounded-full cursor-pointer mb-3 group/bar"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Progress"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            tabIndex={0}
          >
            <div
              className="h-full bg-[#8B5CF6] rounded-full relative group-hover/bar:h-2 transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8B5CF6] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={togglePlay} className="text-[#F8FAFC] hover:text-[#A78BFA] transition-colors" aria-label={isPlaying ? 'Pauza' : 'Ijro'}>
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
              <button type="button" onClick={() => seekBy(-10)} className="text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors" aria-label="10 soniya orqaga">
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
              <div className="flex items-center gap-2 group/vol">
                <button type="button" onClick={toggleMute} className="text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors" aria-label={isMuted ? 'Ovozni yoqish' : 'Ovozni o\'chirish'}>
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = videoRef.current;
                    if (v) {
                      v.volume = Number(e.target.value);
                      v.muted = false;
                    }
                  }}
                  className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-[#8B5CF6] cursor-pointer"
                  aria-label="Ovoz balandligi"
                />
              </div>
              <span className="text-xs text-[#D1D5DB] font-mono tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex items-center gap-1 text-xs font-bold text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors"
                  aria-label="Ijro tezligi"
                >
                  <Settings className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">{playbackSpeed}x</span>
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-8 right-0 bg-[#171A22] border border-white/[0.08] rounded-xl py-1.5 w-24 shadow-2xl z-10">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => changeSpeed(s)}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${s === playbackSpeed ? 'text-[#A78BFA] font-bold' : 'text-[#D1D5DB] hover:text-[#F8FAFC] hover:bg-white/[0.04]'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={togglePiP} className="hidden sm:block text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors" aria-label="Picture-in-Picture">
                <PictureInPicture2 className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="hidden sm:block text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors"
                aria-label="Klaviatura boshqaruvi"
              >
                <Keyboard className="w-4.5 h-4.5" />
              </button>
              <button type="button" onClick={toggleFullscreen} className="text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-colors" aria-label={isFullscreen ? 'To\'liq ekrandan chiqish' : 'To\'liq ekran'}>
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard help overlay */}
        {showHelp && (
          <div className="absolute top-4 right-4 bg-[#171A22]/95 border border-white/[0.08] rounded-xl p-4 text-xs space-y-1.5 shadow-2xl backdrop-blur-md">
            <p className="font-bold text-[#F8FAFC] mb-2 uppercase tracking-[0.08em] text-[10px]">Klaviatura boshqaruvi</p>
            {[
              ['Space / K', 'Ijro / Pauza'],
              ['← / →', '±10 soniya'],
              ['↑ / ↓', 'Ovoz ±10%'],
              ['M', 'Ovozsiz rejim'],
              ['F', 'To\'liq ekran'],
            ].map(([k, d]) => (
              <div key={k} className="flex items-center justify-between gap-4 text-[#9CA3AF]">
                <kbd className="px-1.5 py-0.5 bg-white/[0.04] rounded font-mono text-[10px] text-[#E5E7EB]">{k}</kbd>
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Source info bar — transparency about license and age rating */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
        <span className="px-2.5 py-1 rounded-md bg-[#171A22] border border-white/[0.08] font-semibold text-[#D1D5DB]">
          {source?.label || 'Video'}
        </span>
        <span>Litsenziya: {source?.license || 'Noma\'lum'}</span>
        {source?.ageRating && (
          <span className="px-2 py-0.5 rounded bg-[#F59E0B]/[0.16] border border-[#F59E0B]/[0.3] text-[#FBBF24] font-bold">
            {source.ageRating}
          </span>
        )}
        {user?.name && (
          <span className="ml-auto text-[#6B7280]">
            Ijro davomiyligi qurilmangizda (localStorage) saqlanadi
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
