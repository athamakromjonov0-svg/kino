import React from 'react';

export const Seat = ({
  row,
  seat,
  isTaken,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const handleClick = () => {
    if (isTaken || disabled) return;
    onToggle({ row, seat });
  };

  let seatStyle = "bg-[#27272A] border border-zinc-700 text-zinc-300 hover:border-[#FF4D5A] hover:bg-[#3F3F46]";
  
  if (isTaken) {
    seatStyle = "bg-[#18181F] border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40";
  } else if (isSelected) {
    seatStyle = "bg-[#E50914] border border-[#FF4D5A] text-white shadow-lg shadow-[#E50914]/40 scale-105";
  }

  return (
    <button
      type="button"
      disabled={isTaken || disabled}
      onClick={handleClick}
      title={
        isTaken
          ? `Qator ${row}, Joy ${seat} (Band)`
          : isSelected
          ? `Qator ${row}, Joy ${seat} (Tanlangan)`
          : `Qator ${row}, Joy ${seat} (Bo'sh)`
      }
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-t-lg rounded-b-md text-[11px] font-semibold flex items-center justify-center transition-all duration-150 select-none ${seatStyle}`}
    >
      {/* Visual seat back indicator */}
      <span className="sr-only">Qator {row}, Joy {seat}</span>
      {seat}
    </button>
  );
};

export default Seat;
