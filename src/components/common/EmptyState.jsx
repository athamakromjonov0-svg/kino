import React from 'react';
import { Film } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Film,
  title = "Ma'lumot topilmadi",
  description = "Hozircha hech qanday ma'lumot mavjud emas.",
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#101218] border border-white/[0.08] my-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#171A22] border border-white/[0.08] flex items-center justify-center text-[#9CA3AF] mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-[#A78BFA]" />
      </div>

      <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{title}</h3>
      <p className="text-sm text-[#9CA3AF] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
