import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Film, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#121216] border border-[#27272A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E50914]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-[#E50914] mx-auto shadow-inner">
          <Film className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-5xl sm:text-6xl font-black text-[#E50914] tracking-wider block">
            404
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sahifa topilmadi
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Ortga
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Home}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto glow-red"
          >
            Bosh sahifaga
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
