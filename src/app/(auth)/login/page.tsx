'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: '#FFFFFF' }}>
          Welcome Back
        </h1>
        <p className="text-sm" style={{ color: '#7C849A' }}>
          Sign in to your FitGenie AI account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="input-label">Email Address</label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('email')}
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="input-label">Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('password')}
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#7C849A' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
          style={{ padding: '14px 28px', marginTop: '8px', borderRadius: '14px' }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="gradient-divider" style={{ margin: '24px 0' }} />

      <p className="text-center text-sm" style={{ color: '#7C849A' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold transition-colors"
          style={{ color: '#7BA7FF' }}
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
