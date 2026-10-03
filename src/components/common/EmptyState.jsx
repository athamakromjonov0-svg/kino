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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#121216] border border-[#27272A] my-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-[#FF4D5A]" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
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
