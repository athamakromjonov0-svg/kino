import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Film, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const result = await login(values);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121216] border border-[#27272A] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#18181F] border border-[#27272A] flex items-center justify-center text-[#E50914] shadow-md shadow-[#E50914]/20">
              <Film className="w-5 h-5 text-[#E50914]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              CINE<span className="text-[#E50914]">BOOK</span>
            </span>
          </Link>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Xush kelibsiz!
          </h2>
          <p className="text-xs text-zinc-400">
            Shaxsiy profilingizga kirish uchun login ma'lumotlarini kiriting
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <Input
            label="Email Manzil"
            type="email"
            icon={Mail}
            placeholder="ali@example.com"
            error={errors.email}
            required
            {...register('email')}
          />

          <Input
            label="Parol"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password}
            required
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-[#18181F] border-[#27272A] text-[#E50914] focus:ring-[#E50914] accent-[#E50914]"
                {...register('rememberMe')}
              />
              <span>Meni eslab qol</span>
            </label>

            <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">
              Parolni unutdingizmi?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={LogIn}
            className="w-full glow-red mt-2"
          >
            Kirish
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-[#27272A] relative z-10">
          <p className="text-xs text-zinc-400">
            Hali akkauntingiz yo'qmi?{' '}
            <Link
              to="/register"
              className="text-[#FF4D5A] hover:text-[#E50914] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>Ro'yxatdan o'tish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
