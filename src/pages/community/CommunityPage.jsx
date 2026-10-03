import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, Layers, Star, ArrowRight, Info, TrendingUp, Clapperboard,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import reviewService from '../../services/reviewService';
import actorService from '../../services/actorService';
import collectionService from '../../services/collectionService';
import { formatDateTime } from '../../utils/formatDate';

/**
 * CommunityPage — hub for community features.
 * If the backend has no dedicated community API, the page clearly says so
 * and links to the features that DO work (reviews, actors, collections).
 */
export const CommunityPage = () => {
  const navigate = useNavigate();
  const [latestReviews, setLatestReviews] = useState([]);
  const [topActors, setTopActors] = useState([]);
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      reviewService.getReviews(),
      actorService.getActors({ page: 1, limit: 4 }),
      collectionService.getCollections(),
    ]).then(([reviewsRes, actorsRes, collectionsRes]) => {
      if (!mounted) return;
      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) {
        setLatestReviews(reviewsRes.value.slice(0, 3));
      }
      if (actorsRes.status === 'fulfilled') {
        setTopActors(actorsRes.value.actors || []);
      }
      if (collectionsRes.status === 'fulfilled') {
        setCollectionsCount(Array.isArray(collectionsRes.value) ? collectionsRes.value.length : 0);
      }
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const tiles = [
    {
      to: '/reviews',
      icon: MessageSquare,
      title: 'Sharhlar',
      description: 'Filmlar haqidagi foydalanuvchi fikrlari bilan tanishing',
      accent: 'from-[#E50914]/20 to-transparent',
    },
    {
      to: '/actors',
      icon: Users,
      title: 'Aktyorlar',
      description: 'Sevimli aktyorlaringiz va ularning filmografiyasi',
      accent: 'from-purple-500/20 to-transparent',
    },
    {
      to: '/collections',
      icon: Layers,
      title: 'Kolleksiyalar',
      description: 'Mavzuga qarab tuzilgan film to\'plamlari',
      accent: 'from-emerald-500/20 to-transparent',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-10">
      <PageHeader
        icon={Users}
        title="Hamjamiyat"
        subtitle="Kino muhokamalari, sharhlar va tavsiyalar"
      />

      {/* Honest status notice */}
      <div className="flex items-start gap-3 bg-[#121216] border border-[#27272A] rounded-2xl p-4">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Hamjamiyat moduli hozircha <span className="text-white font-semibold">sharhlar, aktyorlar va kolleksiyalar</span> ustida ishlaydi.
          Forum va foydalanuvchi guruhlari uchun alohida community API kerak — u backend kengaytmasi sifatida README'da hujjatlashtirilgan.
        </p>
      </div>

      {/* Feature tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`group relative bg-[#121216] border border-[#27272A] hover:border-[#E50914]/50 rounded-3xl p-6 overflow-hidden transition-all hover:-translate-y-1`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-[#FF4D5A]">
                <t.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.description}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D5A]">
                O'tish
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Latest reviews preview */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#E50914]" />
            So'nggi sharhlar
          </h2>
          <Link to="/reviews" className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors">
            Barchasi →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#18181F] border border-[#27272A] animate-pulse" />
            ))}
          </div>
        ) : latestReviews.length === 0 ? (
          <p className="text-xs text-zinc-500">Hozircha sharhlar mavjud emas.</p>
        ) : (
          <div className="space-y-3">
            {latestReviews.map((r) => (
              <Link
                key={r.id || r.createdAt}
                to={`/movies/${r.movieId}`}
                className="block bg-[#18181F] border border-[#27272A] hover:border-[#E50914]/40 rounded-2xl p-4 sm:p-5 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-sm font-bold text-white">{r.user || 'Anonim'}</span>
                  {r.rating != null && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {r.rating}/10
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{r.text}</p>
                <p className="text-[11px] text-zinc-600 mt-2">{formatDateTime(r.createdAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Top actors preview */}
      {topActors.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Clapperboard className="w-5 h-5 text-[#E50914]" />
              Mashhur aktyorlar
            </h2>
            <Link to="/actors" className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors">
              Barchasi →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {topActors.map((a) => (
              <button
                key={a.id || a._id}
                type="button"
                onClick={() => navigate(`/actors/${a.id || a._id}`)}
                className="group text-left"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#27272A] group-hover:border-[#E50914]/50 transition-colors bg-zinc-900">
                  <img src={a.image || a.photo} alt={a.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="mt-2 text-xs font-bold text-white group-hover:text-[#FF4D5A] transition-colors truncate">
                  {a.name}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Collections count teaser */}
      {collectionsCount > 0 && (
        <section className="bg-gradient-to-r from-[#18181F] to-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF4D5A]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{collectionsCount} ta mavzuiy kolleksiya</h3>
              <p className="text-xs text-zinc-400">Sci-Fi dan Nolan klassikalarigacha</p>
            </div>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold transition-colors"
          >
            Ko'rish
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}
    </div>
  );
};

export default CommunityPage;
