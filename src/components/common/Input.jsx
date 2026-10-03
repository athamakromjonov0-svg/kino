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
          className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase"
        >
          {label} {required && <span className="text-[#E50914]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          placeholder={placeholder}
          className={`w-full bg-[#18181F] text-white placeholder-zinc-500 text-sm rounded-lg border ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-[#27272A] hover:border-zinc-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]'
          } ${Icon ? 'pl-10' : 'pl-3.5'} ${
            isPassword ? 'pr-10' : 'pr-3.5'
          } py-2.5 outline-none transition-all duration-200 disabled:opacity-50 disabled:bg-zinc-900 ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-zinc-400 hover:text-white transition-colors focus:outline-none p-1"
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
