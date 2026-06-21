import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { calculateBMI, calculateDailyCalories, calculateWaterIntake, formatGoal, getBMICategory } from '@/lib/utils';
import Link from 'next/link';
import {
  Activity,
  Droplets,
  Flame,
  Scale,
  Target,
  Dumbbell,
  MessageSquare,
  TrendingUp,
  User,
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const bmi = profile?.height_cm && profile?.weight_kg
    ? calculateBMI(profile.height_cm, profile.weight_kg)
    : null;

  const dailyCalories = profile?.weight_kg && profile?.height_cm && profile?.age && profile?.gender && profile?.activity_level
    ? calculateDailyCalories(profile.weight_kg, profile.height_cm, profile.age, profile.gender, profile.activity_level)
    : null;

  const waterIntake = profile?.weight_kg
    ? calculateWaterIntake(profile.weight_kg)
    : null;

  const stats = [
    {
      label: 'Current Weight',
      value: profile?.weight_kg ? `${profile.weight_kg} kg` : '—',
      icon: Scale,
      color: 'var(--color-primary)',
      bgColor: 'rgba(108, 99, 255, 0.15)',
    },
    {
      label: 'BMI',
      value: bmi ? `${bmi}` : '—',
      subtitle: bmi ? getBMICategory(bmi) : 'Not calculated',
      icon: Activity,
      color: 'var(--color-secondary)',
      bgColor: 'rgba(0, 217, 255, 0.15)',
    },
    {
      label: 'Daily Calories',
      value: dailyCalories ? `${dailyCalories}` : '—',
      subtitle: 'kcal/day',
      icon: Flame,
      color: 'var(--color-accent)',
      bgColor: 'rgba(255, 107, 157, 0.15)',
    },
    {
      label: 'Water Intake',
      value: waterIntake ? `${waterIntake}` : '—',
      subtitle: 'ml/day',
      icon: Droplets,
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
  ];

  const quickActions = [
    { label: 'Complete Profile', href: '/profile', icon: User, description: 'Set up your fitness profile' },
    { label: 'Generate Plan', href: '/fitness-plan', icon: Sparkles, description: 'Get your AI fitness plan' },
    { label: 'AI Coach', href: '/ai-coach', icon: MessageSquare, description: 'Chat with your coach' },
    { label: 'Log Progress', href: '/progress', icon: TrendingUp, description: 'Track your journey' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{profile?.full_name || 'Fitness Warrior'}</span>! 👋
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Here&apos;s your fitness overview for today.
        </p>
      </div>

      {/* Current Goal */}
      {profile?.goal && (
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(108, 99, 255, 0.15)' }}>
            <Target size={24} className="text-[var(--color-primary-light)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Current Goal</p>
            <p className="text-lg font-semibold">{formatGoal(profile.goal)}</p>
          </div>
          <div className="ml-auto">
            <span className="badge badge-primary">{formatGoal(profile.activity_level)}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bgColor }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {stat.subtitle || stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="glass-card p-5 group text-center"
            >
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <action.icon size={22} className="text-white" />
              </div>
              <h3 className="font-medium text-sm mb-1">{action.label}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="glass-card p-6" style={{ borderColor: 'rgba(108, 99, 255, 0.25)' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
            <Dumbbell size={20} className="text-[var(--color-warning)]" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">💡 Tip of the Day</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Consistency beats intensity. A 30-minute workout done every day is more effective
              than a 3-hour session done once a week. Start small, stay consistent!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
