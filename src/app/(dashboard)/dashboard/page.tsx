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
import CyberCoach3D from '@/components/dashboard/CyberCoach3D';

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
      glow: 'rgba(91, 140, 255, 0.4)',
    },
    {
      label: 'BMI Score',
      value: bmi ? `${bmi}` : '—',
      unit: bmi ? getBMICategory(bmi) : '',
      icon: Activity,
      gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)',
      glow: 'rgba(34, 211, 238, 0.4)',
    },
    {
      label: 'Daily Calories',
      value: dailyCalories ? `${dailyCalories}` : '—',
      unit: dailyCalories ? 'kcal/day' : '',
      icon: Flame,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    {
      label: 'Water Target',
      value: waterIntake ? `${waterIntake}` : '—',
      unit: waterIntake ? 'ml/day' : '',
      icon: Droplets,
      gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
      glow: 'rgba(34, 197, 94, 0.4)',
    },
  ];

  const quickActions = [
    { label: 'Complete Profile', href: '/profile', icon: User, description: 'Set up your fitness profile', gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', glow: 'rgba(91,140,255,0.4)' },
    { label: 'Generate Plan', href: '/fitness-plan', icon: Sparkles, description: 'Get your AI fitness plan', gradient: 'linear-gradient(135deg, #7B61FF 0%, #A855F7 100%)', glow: 'rgba(123,97,255,0.4)' },
    { label: 'AI Coach', href: '/ai-coach', icon: MessageSquare, description: 'Chat with your coach', gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)', glow: 'rgba(34,211,238,0.4)' },
    { label: 'Log Progress', href: '/progress', icon: TrendingUp, description: 'Track your journey', gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)', glow: 'rgba(34,197,94,0.4)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up relative z-10">
      {/* Welcome Section with 3D Coach */}
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#7C849A' }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Welcome back,{' '}
                <span className="gradient-text">
                  {profile?.full_name?.split(' ')[0] || 'Fitness Warrior'}
                </span>
                !
              </h1>
              <p className="text-base mt-2" style={{ color: '#B8C0D4' }}>
                Your cyber coach is ready. Here&apos;s your fitness overview for today.
              </p>
            </div>
            {profile?.goal && (
              <div className="glass flex items-center gap-2 px-5 py-2.5 rounded-2xl shadow-glow">
                <Target size={18} style={{ color: '#7BA7FF' }} />
                <span className="text-sm font-semibold text-white">{formatGoal(profile.goal)}</span>
              </div>
            )}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-6"
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: `0 8px 24px ${stat.glow}`,
                  }}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
                <p className="text-3xl font-bold tracking-tight mb-1 text-white">
                  {stat.value}
                </p>
                <p className="text-sm font-medium" style={{ color: '#B8C0D4' }}>
                  {stat.unit || stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cyber Coach 3D Container */}
        <div className="w-full xl:w-[400px] rounded-3xl overflow-hidden relative glass-surface shadow-primary">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wider">CYBER COACH ACTIVE</span>
          </div>
          <CyberCoach3D />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
          <Zap size={18} style={{ color: '#5B8CFF' }} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="glass-card p-6 text-center block no-underline"
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: action.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: `0 10px 24px ${action.glow}`,
                  transition: 'transform 0.2s',
                }}
              >
                <action.icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-base mb-2 text-white">{action.label}</h3>
              <p className="text-sm" style={{ color: '#B8C0D4' }}>{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="glass-card-elevated p-8 relative">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
          }}
        />
        <div className="flex items-start gap-5">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Dumbbell size={24} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
              💡 Tip of the Day
            </h3>
            <p className="text-base leading-relaxed text-white/80">
              Consistency beats intensity. A 30-minute workout done every day is more effective
              than a 3-hour session done once a week. Start small, stay consistent!
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Link
            href="/ai-coach"
            className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:translate-x-1"
            style={{ color: '#F59E0B' }}
          >
            Ask AI Coach <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
