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
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-premium focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090D] disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97]";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  const variantStyles = {
    // Violet gradient — primary actions only, as per brand direction
    primary:
      "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-[#F8FAFC] border border-[#A78BFA]/25 shadow-[0_8px_24px_-8px_rgba(139,92,246,0.6)] hover:shadow-[0_10px_32px_-6px_rgba(139,92,246,0.75)] hover:brightness-110 focus-visible:ring-[#A78BFA]/70",
    secondary:
      "bg-white/[0.06] text-[#F8FAFC] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.1] hover:border-white/[0.14]",
    danger:
      "bg-red-500/90 text-[#F8FAFC] border border-red-400/30 hover:bg-red-500 focus-visible:ring-red-400/70",
    outline:
      "bg-transparent border border-[#8B5CF6]/45 text-[#C4B5FD] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6] hover:text-[#DDD6FE] focus-visible:ring-[#8B5CF6]/70",
    ghost:
      "bg-transparent text-[#9CA3AF] hover:bg-white/[0.06] hover:text-[#F8FAFC]",
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
