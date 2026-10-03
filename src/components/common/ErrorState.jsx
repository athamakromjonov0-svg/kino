import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = "Xatolik yuz berdi",
  message = "Server bilan aloqa o'rnatishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#18181F]/60 border border-red-500/20 my-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-500/10">
        <AlertTriangle className="w-8 h-8 text-[#FF4D5A]" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="primary"
          size="md"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Qayta urinish
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
