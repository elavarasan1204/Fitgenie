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
  ArrowRight,
  Zap,
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
      value: profile?.weight_kg ? `${profile.weight_kg}` : '—',
      unit: profile?.weight_kg ? 'kg' : '',
      icon: Scale,
      gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
      glow: 'rgba(91, 140, 255, 0.2)',
    },
    {
      label: 'BMI Score',
      value: bmi ? `${bmi}` : '—',
      unit: bmi ? getBMICategory(bmi) : '',
      icon: Activity,
      gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)',
      glow: 'rgba(34, 211, 238, 0.2)',
    },
    {
      label: 'Daily Calories',
      value: dailyCalories ? `${dailyCalories}` : '—',
      unit: dailyCalories ? 'kcal/day' : '',
      icon: Flame,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      glow: 'rgba(245, 158, 11, 0.2)',
    },
    {
      label: 'Water Target',
      value: waterIntake ? `${waterIntake}` : '—',
      unit: waterIntake ? 'ml/day' : '',
      icon: Droplets,
      gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
      glow: 'rgba(34, 197, 94, 0.2)',
    },
  ];

  const quickActions = [
    { label: 'Complete Profile', href: '/profile', icon: User, description: 'Set up your fitness profile', gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', glow: 'rgba(91,140,255,0.2)' },
    { label: 'Generate Plan', href: '/fitness-plan', icon: Sparkles, description: 'Get your AI fitness plan', gradient: 'linear-gradient(135deg, #7B61FF 0%, #A855F7 100%)', glow: 'rgba(123,97,255,0.2)' },
    { label: 'AI Coach', href: '/ai-coach', icon: MessageSquare, description: 'Chat with your coach', gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)', glow: 'rgba(34,211,238,0.2)' },
    { label: 'Log Progress', href: '/progress', icon: TrendingUp, description: 'Track your journey', gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)', glow: 'rgba(34,197,94,0.2)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: '#7C849A' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {profile?.full_name?.split(' ')[0] || 'Fitness Warrior'}
            </span>
            !
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#7C849A' }}>
            Here&apos;s your fitness overview for today.
          </p>
        </div>
        {profile?.goal && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'rgba(91, 140, 255, 0.08)',
              border: '1px solid rgba(91, 140, 255, 0.15)',
              flexShrink: 0,
            }}
          >
            <Target size={15} style={{ color: '#7BA7FF' }} />
            <span className="text-sm font-medium" style={{ color: '#B8C0D4' }}>{formatGoal(profile.goal)}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(14, 20, 40, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,140,255,0.15)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${stat.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '';
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: stat.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: `0 6px 20px ${stat.glow}`,
              }}
            >
              <stat.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#FFFFFF' }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium" style={{ color: '#7C849A' }}>
              {stat.unit || stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: '#B8C0D4' }}>
          <Zap size={15} style={{ color: '#5B8CFF' }} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                background: 'rgba(14, 20, 40, 0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '18px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textDecoration: 'none',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(91,140,255,0.06)';
                el.style.borderColor = 'rgba(91,140,255,0.18)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = `0 12px 36px rgba(0,0,0,0.3), 0 0 20px ${action.glow}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(14, 20, 40, 0.5)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.transform = '';
                el.style.boxShadow = '';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: action.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: `0 8px 24px ${action.glow}`,
                  transition: 'transform 0.2s',
                }}
              >
                <action.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: '#FFFFFF' }}>{action.label}</h3>
              <p className="text-xs" style={{ color: '#7C849A' }}>{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div
        style={{
          background: 'rgba(14, 20, 40, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
          }}
        />
        <div className="flex items-start gap-4">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Dumbbell size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <h3 className="font-semibold mb-1.5 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
              💡 Tip of the Day
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#B8C0D4' }}>
              Consistency beats intensity. A 30-minute workout done every day is more effective
              than a 3-hour session done once a week. Start small, stay consistent!
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            href="/ai-coach"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: '#F59E0B' }}
          >
            Ask AI Coach <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
