import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090B] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary: "bg-[#E50914] hover:bg-[#c40811] text-white shadow-lg shadow-[#E50914]/20 focus:ring-[#E50914] border border-[#FF4D5A]/20 hover:shadow-[#E50914]/40",
    secondary: "bg-[#18181F] hover:bg-[#27272A] text-white border border-[#27272A] hover:border-[#3F3F46] focus:ring-[#27272A]",
    danger: "bg-red-600/90 hover:bg-red-600 text-white border border-red-500/30 focus:ring-red-500",
    outline: "bg-transparent border border-[#27272A] hover:border-[#E50914] text-white hover:text-[#FF4D5A] focus:ring-[#E50914]",
    ghost: "bg-transparent hover:bg-[#18181F] text-zinc-300 hover:text-white focus:ring-zinc-700",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
