import React from 'react';

export const Loader = ({ fullScreen = false, text = "Yuklanmoqda..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse ring */}
        <div className="w-16 h-16 rounded-full border-2 border-[#E50914]/20 animate-ping absolute" />
        
        {/* Spinning border ring */}
        <div className="w-14 h-14 rounded-full border-3 border-transparent border-t-[#E50914] border-r-[#FF4D5A] animate-spin" />
        
        {/* Inner movie icon dot */}
        <div className="w-3 h-3 bg-[#E50914] rounded-full shadow-[0_0_12px_#E50914] absolute" />
      </div>

      {text && (
        <p className="text-sm font-medium text-zinc-400 tracking-wider uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#09090B] flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
