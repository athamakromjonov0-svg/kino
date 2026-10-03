import React, { useMemo } from 'react';
import Seat from './Seat';
import toast from 'react-hot-toast';

export const SeatMap = ({
  seats = [],
  selectedSeats = [],
  onSeatSelect,
  maxSeats = 4,
}) => {
  // Group seats by row number
  const rowsMap = useMemo(() => {
    const map = {};
    seats.forEach((s) => {
      const rowNum = s.row;
      if (!map[rowNum]) {
        map[rowNum] = [];
      }
      map[rowNum].push(s);
    });

    // Sort seats in each row by seat number
    Object.keys(map).forEach((r) => {
      map[r].sort((a, b) => a.seat - b.seat);
    });

    return map;
  }, [seats]);

  const sortedRows = useMemo(() => {
    return Object.keys(rowsMap).sort((a, b) => Number(a) - Number(b));
  }, [rowsMap]);

  const handleSeatToggle = (seatObj) => {
    const isAlreadySelected = selectedSeats.some(
      (s) => s.row === seatObj.row && s.seat === seatObj.seat
    );

    if (isAlreadySelected) {
      onSeatSelect(
        selectedSeats.filter(
          (s) => !(s.row === seatObj.row && s.seat === seatObj.seat)
        )
      );
    } else {
      if (selectedSeats.length >= maxSeats) {
        toast.error(`Bitta seans uchun maksimum ${maxSeats} ta joy tanlash mumkin!`);
        return;
      }
      onSeatSelect([...selectedSeats, seatObj]);
    }
  };

  return (
    <div className="w-full bg-[#121216] border border-[#27272A] rounded-2xl p-6 sm:p-8 flex flex-col items-center select-none shadow-xl">
      {/* Cinema Screen Section */}
      <div className="w-full max-w-xl mb-12 flex flex-col items-center">
        {/* Curved Glowing Screen Bar */}
        <div className="relative w-full h-8 flex items-center justify-center">
          <div className="w-full h-2.5 bg-gradient-to-r from-transparent via-[#E50914] to-transparent rounded-full shadow-[0_0_25px_rgba(229,9,20,0.8)]" />
          <div className="absolute -top-3 w-4/5 h-6 bg-gradient-to-b from-[#E50914]/20 to-transparent blur-md rounded-t-full pointer-events-none" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-bold mt-2">
          CINEMA SCREEN
        </span>
      </div>

      {/* Seats Grid Container with horizontal scroll if needed */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="space-y-3 min-w-max px-2">
          {sortedRows.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-sm">
              Joylar xaritasi mavjud emas yoki yuklanmoqda...
            </div>
          ) : (
            sortedRows.map((rowNum) => {
              const rowSeats = rowsMap[rowNum];
              return (
                <div key={rowNum} className="flex items-center gap-2 sm:gap-3">
                  {/* Left Row Number */}
                  <div className="w-6 text-center text-xs font-mono font-bold text-zinc-400">
                    {rowNum}
                  </div>

                  {/* Seat Items */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map((s) => {
                      const isSelected = selectedSeats.some(
                        (sel) => sel.row === s.row && sel.seat === s.seat
                      );
                      return (
                        <Seat
                          key={`${s.row}-${s.seat}`}
                          row={s.row}
                          seat={s.seat}
                          isTaken={s.taken}
                          isSelected={isSelected}
                          onToggle={handleSeatToggle}
                        />
                      );
                    })}
                  </div>

                  {/* Right Row Number */}
                  <div className="w-6 text-center text-xs font-mono font-bold text-zinc-400">
                    {rowNum}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Seats Legend */}
      <div className="mt-8 pt-6 border-t border-[#27272A] w-full flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-[#27272A] border border-zinc-700" />
          <span>Bo'sh joy</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-[#E50914] border border-[#FF4D5A] shadow-sm shadow-[#E50914]" />
          <span className="font-semibold text-white">Tanlangan</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t bg-[#18181F] border border-zinc-800 opacity-50" />
          <span className="text-zinc-500">Band qilingan</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
