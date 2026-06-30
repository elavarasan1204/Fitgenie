'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { progressLogSchema, type ProgressLogFormData } from '@/validations/progress';
import { createClient } from '@/lib/supabase/client';
import { calculateBMI } from '@/lib/utils';
import { toast } from 'sonner';
import type { ProgressLog } from '@/types';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Plus, Loader2, Scale, Droplets, Dumbbell, TrendingUp,
  CalendarDays, Activity, X,
} from 'lucide-react';

const cardStyle = {
  background: 'rgba(14, 20, 40, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  padding: '24px',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(14, 20, 40, 0.95)',
    border: '1px solid rgba(91,140,255,0.2)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    fontSize: '0.75rem',
    color: '#FFFFFF',
  },
  labelStyle: { color: '#B8C0D4' },
};

export default function ProgressPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [profileHeight, setProfileHeight] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgressLogFormData>({
    resolver: zodResolver(progressLogSchema) as any,
    defaultValues: {
      log_date: new Date().toISOString().split('T')[0],
      workout_completed: false,
    },
  });

  const fetchLogs = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('height_cm')
      .eq('id', user.id)
      .single();

    if (profile?.height_cm) setProfileHeight(profile.height_cm);

    const { data } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true });

    setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const onSubmit = async (data: ProgressLogFormData) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Not authenticated'); return; }

      const { error } = await supabase
        .from('progress_logs')
        .upsert({
          user_id: user.id,
          log_date: data.log_date,
          weight_kg: data.weight_kg || null,
          water_ml: data.water_ml || null,
          workout_completed: data.workout_completed,
          workout_notes: data.workout_notes || null,
        }, { onConflict: 'user_id,log_date' });

      if (error) { toast.error('Failed to save log'); return; }

      toast.success('Progress logged! 📊');
      reset();
      setShowForm(false);
      fetchLogs();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // Chart data
  const weightData = logs
    .filter(l => l.weight_kg)
    .map(l => ({
      date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: l.weight_kg,
    }));

  const bmiData = logs
    .filter(l => l.weight_kg && profileHeight)
    .map(l => ({
      date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bmi: calculateBMI(profileHeight!, l.weight_kg!),
    }));

  const waterData = logs
    .filter(l => l.water_ml !== null)
    .map(l => ({
      date: new Date(l.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      water: l.water_ml,
    }));

  const workoutData = (() => {
    const last30 = logs.slice(-30);
    const completed = last30.filter(l => l.workout_completed).length;
    const total = last30.length || 1;
    const weeklyGroups: Record<string, { done: number; total: number }> = {};
    last30.forEach(l => {
      const d = new Date(l.log_date);
      const weekKey = `W${Math.ceil(d.getDate() / 7)}`;
      if (!weeklyGroups[weekKey]) weeklyGroups[weekKey] = { done: 0, total: 0 };
      weeklyGroups[weekKey].total++;
      if (l.workout_completed) weeklyGroups[weekKey].done++;
    });
    return {
      rate: Math.round((completed / total) * 100),
      weekly: Object.entries(weeklyGroups).map(([week, data]) => ({
        week,
        rate: Math.round((data.done / data.total) * 100),
      })),
    };
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(91,140,255,0.3)' }}>
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
          <p style={{ color: '#7C849A', fontSize: '0.875rem' }}>Loading your progress...</p>
        </div>
      </div>
    );
  }

  const summaryStats = [
    {
      label: 'Latest Weight',
      value: weightData.length > 0 ? `${weightData[weightData.length - 1].weight} kg` : '—',
      icon: Scale,
      gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
      glow: 'rgba(91,140,255,0.25)',
    },
    {
      label: 'Current BMI',
      value: bmiData.length > 0 ? bmiData[bmiData.length - 1].bmi : '—',
      icon: Activity,
      gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)',
      glow: 'rgba(34,211,238,0.25)',
    },
    {
      label: 'Last Water Intake',
      value: waterData.length > 0 ? `${waterData[waterData.length - 1].water} ml` : '—',
      icon: Droplets,
      gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)',
      glow: 'rgba(34,197,94,0.25)',
    },
    {
      label: 'Completion Rate',
      value: `${workoutData.rate}%`,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      glow: 'rgba(245,158,11,0.25)',
    },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>
            Progress Tracking
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#7C849A' }}>
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'} logged · Stay consistent!
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Log Progress'}
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div
          className="mb-8 animate-scale-in"
          style={{
            background: 'rgba(14, 20, 40, 0.7)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(91,140,255,0.15)',
            borderRadius: '20px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top gradient accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)' }} />

          <h2 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(91,140,255,0.3)' }}>
              <Plus size={14} className="text-white" />
            </div>
            Log Today&apos;s Progress
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label htmlFor="log_date" className="input-label">
                  <CalendarDays size={12} className="inline mr-1.5" /> Date
                </label>
                <input
                  {...register('log_date')}
                  id="log_date"
                  type="date"
                  className={`input-field ${errors.log_date ? 'input-error' : ''}`}
                />
                {errors.log_date && <p className="error-message">{errors.log_date.message}</p>}
              </div>

              <div>
                <label htmlFor="weight_kg" className="input-label">
                  <Scale size={12} className="inline mr-1.5" /> Weight (kg)
                </label>
                <input
                  {...register('weight_kg')}
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  className="input-field"
                  placeholder="70.5"
                />
              </div>

              <div>
                <label htmlFor="water_ml" className="input-label">
                  <Droplets size={12} className="inline mr-1.5" /> Water (ml)
                </label>
                <input
                  {...register('water_ml')}
                  id="water_ml"
                  type="number"
                  className="input-field"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="input-label">
                  <Dumbbell size={12} className="inline mr-1.5" /> Workout
                </label>
                <label
                  className="flex items-center gap-3 mt-2.5 cursor-pointer"
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'rgba(14,20,40,0.8)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <input
                    {...register('workout_completed')}
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#5B8CFF' }}
                  />
                  <span className="text-sm" style={{ color: '#B8C0D4' }}>Completed today</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="workout_notes" className="input-label">Notes (optional)</label>
              <textarea
                {...register('workout_notes')}
                id="workout_notes"
                className="textarea-field"
                placeholder="How was your workout? Any notes..."
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Save Log
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(14, 20, 40, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px',
              padding: '18px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px)';
              el.style.borderColor = 'rgba(91,140,255,0.15)';
              el.style.boxShadow = `0 12px 36px rgba(0,0,0,0.3), 0 0 20px ${stat.glow}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = '';
              el.style.borderColor = 'rgba(255,255,255,0.07)';
              el.style.boxShadow = '';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: stat.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: `0 6px 18px ${stat.glow}`,
              }}
            >
              <stat.icon size={17} className="text-white" />
            </div>
            <p className="text-xl font-bold" style={{ color: '#FFFFFF' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#7C849A' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {logs.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            textAlign: 'center',
            padding: '64px 24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(91,140,255,0.08)',
              border: '1px solid rgba(91,140,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <TrendingUp size={28} style={{ color: '#7C849A' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#FFFFFF' }}>No data yet</h3>
          <p className="text-sm mb-6" style={{ color: '#B8C0D4' }}>
            Start logging your progress to see beautiful charts here.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Log First Entry
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weight Trend */}
          {weightData.length > 0 && (
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #5B8CFF, #7B61FF)' }} />
              <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(91,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={13} style={{ color: '#7BA7FF' }} />
                </div>
                Weight Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7C849A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#7C849A' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#5B8CFF"
                    strokeWidth={2.5}
                    dot={{ fill: '#5B8CFF', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#7BA7FF', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BMI Trend */}
          {bmiData.length > 0 && (
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #22D3EE, #5B8CFF)' }} />
              <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(34,211,238,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={13} style={{ color: '#22D3EE' }} />
                </div>
                BMI Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={bmiData}>
                  <defs>
                    <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7C849A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#7C849A' }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="bmi" stroke="#22D3EE" strokeWidth={2.5} fill="url(#bmiGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Water Intake */}
          {waterData.length > 0 && (
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #22C55E, #22D3EE)' }} />
              <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={13} style={{ color: '#22C55E' }} />
                </div>
                Water Intake
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={waterData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7C849A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#7C849A' }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} formatter={(v: any) => [`${v} ml`, 'Water']} />
                  <defs>
                    <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="water" fill="url(#waterGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Workout Completion */}
          {workoutData.weekly.length > 0 && (
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
              <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell size={13} style={{ color: '#F59E0B' }} />
                </div>
                Workout Completion
                <span className="badge badge-warning ml-auto">{workoutData.rate}%</span>
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={workoutData.weekly} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#7C849A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#7C849A' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} formatter={(value: any) => [`${value}%`, 'Completion']} />
                  <defs>
                    <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="rate" fill="url(#workoutGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
