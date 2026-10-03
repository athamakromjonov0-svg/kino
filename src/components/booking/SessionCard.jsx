import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, Ticket } from 'lucide-react';
import { formatDateTime, formatTime, formatDate } from '../../utils/formatDate';

export const SessionCard = ({ session }) => {
  const navigate = useNavigate();

  if (!session) return null;

  const sessionId = session.id || session._id || session.sessionId;
  const hallName = session.hall || session.room || session.auditorium || `Zal #${session.hallId || 1}`;
  const rawTime = session.time || session.date || session.startTime;

  const handleSelect = () => {
    navigate(`/booking/${sessionId}`);
  };

  return (
    <div className="bg-[#18181F] border border-[#27272A] hover:border-[#E50914]/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-[#E50914]/5 group">
      {/* Session Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4D5A] text-xs font-bold font-mono">
            ID: #{sessionId}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{hallName}</span>
          </div>
        </div>

        {rawTime && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 bg-[#121216] px-2.5 py-1 rounded-lg border border-[#27272A]">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{formatTime(rawTime) || rawTime}</span>
            </div>
            <span className="text-zinc-500">{formatDate(rawTime)}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div>
        <button
          type="button"
          onClick={handleSelect}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#c40811] text-white text-xs font-bold shadow-md shadow-[#E50914]/20 transition-all hover:scale-[1.02]"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Joy tanlash</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
