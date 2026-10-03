import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#121216] border border-[#27272A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-[#FF4D5A] tracking-wider block">
            401 / 403
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Ruxsat cheklangan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Ushbu sahifani ko'rish uchun profilingizga kirishingiz yoki tegishli ruxsatga ega bo'lishingiz kerak.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            variant="primary"
            size="md"
            icon={LogIn}
            onClick={handleLogin}
            className="w-full sm:w-auto glow-red"
          >
            Tizimga kirish
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={Home}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Bosh sahifa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
