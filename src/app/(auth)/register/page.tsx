'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: '#FFFFFF' }}>
          Create Account
        </h1>
        <p className="text-sm" style={{ color: '#7C849A' }}>
          Start your AI-powered fitness journey today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="register-full-name" className="input-label">Full Name</label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('full_name')}
              id="register-full-name"
              type="text"
              placeholder="John Doe"
              className={`input-field ${errors.full_name ? 'input-error' : ''}`}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          {errors.full_name && <p className="error-message">{errors.full_name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="input-label">Email Address</label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('email')}
              id="register-email"
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
          <label htmlFor="register-password" className="input-label">Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('password')}
              id="register-password"
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="register-confirm-password" className="input-label">Confirm Password</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#7C849A' }}
            />
            <input
              {...register('confirm_password')}
              id="register-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input-field ${errors.confirm_password ? 'input-error' : ''}`}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#7C849A' }}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm_password && <p className="error-message">{errors.confirm_password.message}</p>}
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
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="gradient-divider" style={{ margin: '24px 0' }} />

      <p className="text-center text-sm" style={{ color: '#7C849A' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold transition-colors"
          style={{ color: '#7BA7FF' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
