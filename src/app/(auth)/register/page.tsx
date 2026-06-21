'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Loader2, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Account created successfully!');
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
      <h1 className="text-2xl font-bold mb-1">Create Account</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Start your AI-powered fitness journey
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="input-label">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              {...register('full_name')}
              id="full_name"
              type="text"
              placeholder="John Doe"
              className={`input-field !pl-11 ${errors.full_name ? 'input-error' : ''}`}
            />
          </div>
          {errors.full_name && <p className="error-message">{errors.full_name.message}</p>}
        </div>

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

        <div>
          <label htmlFor="confirm_password" className="input-label">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              {...register('confirm_password')}
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              className={`input-field !pl-11 ${errors.confirm_password ? 'input-error' : ''}`}
            />
          </div>
          {errors.confirm_password && <p className="error-message">{errors.confirm_password.message}</p>}
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
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-primary-light)] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
