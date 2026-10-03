import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  icon: Icon,
  className = '',
  id,
  placeholder,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold text-[#9CA3AF] tracking-[0.08em] uppercase"
        >
          {label} {required && <span className="text-[#8B5CF6]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#6B7280] pointer-events-none flex items-center transition-colors peer-focus:text-[#A78BFA]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          placeholder={placeholder}
          className={`w-full bg-[#101218] text-[#F8FAFC] placeholder-[#52525B] text-sm rounded-xl border ${
            error
              ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/25'
              : 'border-white/[0.08] hover:border-white/[0.14] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25'
          } ${Icon ? 'pl-10' : 'pl-3.5'} ${
            isPassword ? 'pr-10' : 'pr-3.5'
          } py-2.5 outline-none transition-all duration-200 ease-premium disabled:opacity-40 disabled:bg-[#0B0D12] ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#6B7280] hover:text-[#A78BFA] transition-colors focus:outline-none p-1"
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <span>{typeof error === 'string' ? error : error?.message}</span>
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
