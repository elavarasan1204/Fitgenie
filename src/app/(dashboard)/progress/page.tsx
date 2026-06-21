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
  CalendarDays, Activity,
} from 'lucide-react';

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

    // Get profile for height
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

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

      if (error) {
        toast.error('Failed to save log');
        return;
      }

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
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Progress Tracking</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            {logs.length} entries logged
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={18} /> Log Progress
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5">📝 Log Today&apos;s Progress</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label htmlFor="log_date" className="input-label">
                  <CalendarDays size={14} className="inline mr-1" /> Date
                </label>
                <input {...register('log_date')} id="log_date" type="date" className={`input-field ${errors.log_date ? 'input-error' : ''}`} />
                {errors.log_date && <p className="error-message">{errors.log_date.message}</p>}
              </div>
              <div>
                <label htmlFor="weight_kg" className="input-label">
                  <Scale size={14} className="inline mr-1" /> Weight (kg)
                </label>
                <input {...register('weight_kg')} id="weight_kg" type="number" step="0.1" className="input-field" placeholder="70.5" />
              </div>
              <div>
                <label htmlFor="water_ml" className="input-label">
                  <Droplets size={14} className="inline mr-1" /> Water (ml)
                </label>
                <input {...register('water_ml')} id="water_ml" type="number" className="input-field" placeholder="2500" />
              </div>
              <div>
                <label className="input-label">
                  <Dumbbell size={14} className="inline mr-1" /> Workout
                </label>
                <label className="flex items-center gap-3 mt-3 cursor-pointer">
                  <input {...register('workout_completed')} type="checkbox" className="w-5 h-5 rounded accent-[var(--color-primary)]" />
                  <span className="text-sm">Completed today</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="workout_notes" className="input-label">Notes (optional)</label>
              <textarea {...register('workout_notes')} id="workout_notes" className="textarea-field" placeholder="How was your workout?" rows={2} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Save Log
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <Scale size={20} className="text-[var(--color-primary-light)] mx-auto mb-2" />
          <div className="text-xl font-bold">{weightData.length > 0 ? `${weightData[weightData.length - 1].weight} kg` : '—'}</div>
          <div className="text-xs text-[var(--color-text-muted)]">Latest Weight</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Activity size={20} className="text-[var(--color-secondary)] mx-auto mb-2" />
          <div className="text-xl font-bold">{bmiData.length > 0 ? bmiData[bmiData.length - 1].bmi : '—'}</div>
          <div className="text-xs text-[var(--color-text-muted)]">Current BMI</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Droplets size={20} className="text-[var(--color-success)] mx-auto mb-2" />
          <div className="text-xl font-bold">{waterData.length > 0 ? `${waterData[waterData.length - 1].water} ml` : '—'}</div>
          <div className="text-xs text-[var(--color-text-muted)]">Last Water Intake</div>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp size={20} className="text-[var(--color-accent)] mx-auto mb-2" />
          <div className="text-xl font-bold">{workoutData.rate}%</div>
          <div className="text-xs text-[var(--color-text-muted)]">Completion Rate</div>
        </div>
      </div>

      {/* Charts */}
      {logs.length === 0 ? (
        <div className="glass-card p-12 text-center" style={{ transform: 'none' }}>
          <TrendingUp size={48} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No data yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Start logging your progress to see beautiful charts here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weight Trend */}
          {weightData.length > 0 && (
            <div className="chart-container">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Scale size={16} className="text-[var(--color-primary-light)]" /> Weight Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid #3A3A5C', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#EAEAFF' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#6C63FF" strokeWidth={2} dot={{ fill: '#6C63FF', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BMI Trend */}
          {bmiData.length > 0 && (
            <div className="chart-container">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[var(--color-secondary)]" /> BMI Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid #3A3A5C', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#EAEAFF' }}
                  />
                  <defs>
                    <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="bmi" stroke="#00D9FF" strokeWidth={2} fill="url(#bmiGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Water Intake */}
          {waterData.length > 0 && (
            <div className="chart-container">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Droplets size={16} className="text-[var(--color-success)]" /> Water Intake
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid #3A3A5C', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#EAEAFF' }}
                  />
                  <Bar dataKey="water" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Workout Completion */}
          {workoutData.weekly.length > 0 && (
            <div className="chart-container">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Dumbbell size={16} className="text-[var(--color-accent)]" /> Workout Completion
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workoutData.weekly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid #3A3A5C', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#EAEAFF' }}
                    formatter={(value: any) => [`${value}%`, 'Completion']}
                  />
                  <Bar dataKey="rate" fill="#FF6B9D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
