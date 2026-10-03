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
      <div className="w-full max-w-md bg-[#101218] border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#171A22] border border-white/[0.08] flex items-center justify-center text-[#8B5CF6] shadow-md shadow-[#8B5CF6]/20">
              <Film className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">
              CINE<span className="text-[#8B5CF6]">ORA</span>
            </span>
          </Link>

          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Xush kelibsiz!
          </h2>
          <p className="text-xs text-[#9CA3AF]">
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
            <label className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#D1D5DB] cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-[#171A22] border-white/[0.08] text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6]"
                {...register('rememberMe')}
              />
              <span>Meni eslab qol</span>
            </label>

            <span className="text-[#6B7280] hover:text-[#9CA3AF] cursor-pointer">
              Parolni unutdingizmi?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={LogIn}
            className="w-full glow-violet mt-2"
          >
            Kirish
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-white/[0.08] relative z-10">
          <p className="text-xs text-[#9CA3AF]">
            Hali akkauntingiz yo'qmi?{' '}
            <Link
              to="/register"
              className="text-[#A78BFA] hover:text-[#8B5CF6] font-semibold transition-colors inline-flex items-center gap-1"
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
