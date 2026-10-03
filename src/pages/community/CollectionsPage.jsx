import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Film } from 'lucide-react';
import collectionService from '../../services/collectionService';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { getErrorMessage } from '../../utils/errorHandler';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';

/**
 * CollectionsPage — curated movie collections (backend extension GET /collections).
 */
export const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await collectionService.getCollections();
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (isLoading) {
    return <Loader fullScreen text="Kolleksiyalar yuklanmoqda..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ErrorState title="Kolleksiyalarni yuklab bo'lmadi" message={error} onRetry={fetchCollections} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <PageHeader
        icon={Layers}
        title="Kolleksiyalar"
        subtitle="Mavzuga qarab tuzilgan film to'plamlari"
        badge={
          <span className="px-3 py-1.5 rounded-xl bg-[#171A22] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB]">
            {collections.length} ta kolleksiya
          </span>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Kolleksiyalar mavjud emas"
          description="Backendda kolleksiyalar endpoint hozircha bo'sh."
          actionText="Filmlarni ko'rish"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((c) => {
            const movies = c.movies || [];
            return (
              <button
                key={c.id || c._id}
                type="button"
                onClick={() => navigate(`/collections/${c.id || c._id}`)}
                className="group bg-[#101218] border border-white/[0.08] hover:border-[#8B5CF6]/50 rounded-2xl p-6 text-left space-y-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8B5CF6]/10 focus:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#171A22] border border-white/[0.08] text-[11px] font-bold text-[#D1D5DB]">
                    {movies.length} ta film
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors">
                    {c.name}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>

                {/* Poster strip */}
                {movies.length > 0 ? (
                  <div className="flex -space-x-6">
                    {movies.slice(0, 4).map((m, i) => (
                      <img
                        key={m.id || i}
                        src={m.poster || FALLBACK_POSTER}
                        alt={m.title}
                        loading="lazy"
                        className="w-16 aspect-[2/3] object-cover rounded-lg border-2 border-[#101218] shadow-md"
                        style={{ zIndex: movies.slice(0, 4).length - i }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <Film className="w-3.5 h-3.5" />
                    Filmlar backendda bog'lanmagan
                  </div>
                )}

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA]">
                  Kolleksiyani ko'rish
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
