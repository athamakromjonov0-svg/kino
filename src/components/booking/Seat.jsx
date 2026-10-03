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

  let seatStyle = "bg-white/[0.04] border border-white/[0.1] text-[#D1D5DB] hover:border-[#A78BFA] hover:bg-white/[0.08]";
  
  if (isTaken) {
    seatStyle = "bg-[#171A22] border border-white/[0.06] text-[#6B7280] cursor-not-allowed opacity-40";
  } else if (isSelected) {
    seatStyle = "bg-[#8B5CF6] border border-[#A78BFA] text-[#F8FAFC] shadow-lg shadow-[#8B5CF6]/40 scale-105";
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
