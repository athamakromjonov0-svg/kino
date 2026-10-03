import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Film, User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const result = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Ro'yxatdan o'tish muvaffaqiyatli! Endi tizimga kiring.");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#101218] border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient element */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#A78BFA]/15 rounded-full blur-3xl pointer-events-none" />

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
            Ro'yxatdan o'tish
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Cineora platformasining barcha imkoniyatlaridan to'liq foydalaning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <Input
            label="To'liq Ism (Full Name)"
            type="text"
            icon={User}
            placeholder="Ali Valiyev"
            error={errors.name}
            required
            {...register('name')}
          />

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
            placeholder="Kamida 6 ta belgi"
            error={errors.password}
            required
            {...register('password')}
          />

          <Input
            label="Parolni Tasdiqlang"
            type="password"
            icon={Lock}
            placeholder="Parolni qayta kiriting"
            error={errors.confirmPassword}
            required
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={UserPlus}
            className="w-full glow-violet mt-3"
          >
            Hisob yaratish
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-white/[0.08] relative z-10">
          <p className="text-xs text-[#9CA3AF]">
            Allaqachon hisobingiz bormi?{' '}
            <Link
              to="/login"
              className="text-[#A78BFA] hover:text-[#8B5CF6] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>Kirish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
