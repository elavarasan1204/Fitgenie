'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Sign in to your FitGenie AI account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="input-label">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`input-field !pl-11 ${errors.email ? 'input-error' : ''}`}
            />
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="input-label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="••••••••"
              className={`input-field !pl-11 ${errors.password ? 'input-error' : ''}`}
            />
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center !py-3.5"
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

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[var(--color-primary-light)] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
