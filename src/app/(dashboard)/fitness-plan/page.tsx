'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { FitnessPlan, FitnessPlanData, PlanModification } from '@/types';
import {
  Sparkles,
  Loader2,
  Dumbbell,
  Utensils,
  Droplets,
  Flame,
  Heart,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  Activity,
  Coffee,
  Moon,
  Apple,
} from 'lucide-react';

export default function FitnessPlanPage() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('overview');
  const [modifications, setModifications] = useState<PlanModification[] | null>(null);
  const [modSummary, setModSummary] = useState('');
  const [showModModal, setShowModModal] = useState(false);
  const [applyingMod, setApplyingMod] = useState(false);

  const fetchPlan = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    setPlan(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/fitness-plan/generate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate plan');
        return;
      }
      setPlan(data.plan);
      toast.success('Fitness plan generated successfully! 🎉');
    } catch {
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApplyModifications = async () => {
    if (!plan || !modifications) return;
    setApplyingMod(true);
    try {
      const updatedPlanData = { ...plan.plan_data as FitnessPlanData };

      // Apply each modification
      for (const mod of modifications) {
        const key = mod.section as keyof FitnessPlanData;
        if (key in updatedPlanData) {
          (updatedPlanData as Record<string, unknown>)[key] = mod.proposed_value;
        }
      }

      const res = await fetch('/api/fitness-plan/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.id,
          updated_plan_data: updatedPlanData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to apply changes');
        return;
      }

      setPlan(data.plan);
      setShowModModal(false);
      setModifications(null);
      toast.success('Plan updated successfully! ✅');
    } catch {
      toast.error('Failed to apply modifications');
    } finally {
      setApplyingMod(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // No plan yet - show generate button
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
          <Sparkles size={40} className="text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Generate Your AI Fitness Plan</h1>
        <p className="text-[var(--color-text-secondary)] max-w-md mb-8">
          Complete your profile first, then let AI create a personalized workout and nutrition plan just for you.
        </p>
        <button onClick={generatePlan} disabled={generating} className="btn-primary !py-4 !px-8 text-base">
          {generating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate My Plan
            </>
          )}
        </button>
      </div>
    );
  }

  const planData = plan.plan_data as FitnessPlanData;

  const sections = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'workout', label: 'Workout Schedule', icon: Calendar },
    { key: 'breakfast', label: 'Breakfast', icon: Coffee },
    { key: 'lunch', label: 'Lunch', icon: Utensils },
    { key: 'dinner', label: 'Dinner', icon: Moon },
    { key: 'snacks', label: 'Snacks', icon: Apple },
    { key: 'recovery', label: 'Recovery', icon: Heart },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Your Fitness Plan</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Version {plan.version} · Generated {new Date(plan.created_at).toLocaleDateString()}
          </p>
        </div>
        <button onClick={generatePlan} disabled={generating} className="btn-secondary">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Regenerate Plan
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <Flame size={20} className="text-[var(--color-accent)] mx-auto mb-2" />
          <div className="text-xl font-bold">{planData.daily_calorie_target}</div>
          <div className="text-xs text-[var(--color-text-muted)]">kcal/day</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Droplets size={20} className="text-[var(--color-secondary)] mx-auto mb-2" />
          <div className="text-xl font-bold">{planData.water_intake_target}</div>
          <div className="text-xs text-[var(--color-text-muted)]">ml water/day</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Dumbbell size={20} className="text-[var(--color-primary-light)] mx-auto mb-2" />
          <div className="text-xl font-bold">{planData.weekly_workout_schedule?.filter(d => !d.rest_day).length || 0}</div>
          <div className="text-xs text-[var(--color-text-muted)]">workout days</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Heart size={20} className="text-[var(--color-success)] mx-auto mb-2" />
          <div className="text-xl font-bold">{planData.weekly_workout_schedule?.filter(d => d.rest_day).length || 0}</div>
          <div className="text-xs text-[var(--color-text-muted)]">rest days</div>
        </div>
      </div>

      {/* Sections Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === s.key
                ? 'gradient-primary text-white'
                : 'glass text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            <s.icon size={16} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {activeSection === 'overview' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="glass-card p-6" style={{ transform: 'none' }}>
              <h3 className="font-semibold mb-2">👤 User Summary</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{planData.user_summary}</p>
            </div>
            <div className="glass-card p-6" style={{ transform: 'none' }}>
              <h3 className="font-semibold mb-2">🎯 Goal Summary</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{planData.goal_summary}</p>
            </div>
            <div className="glass-card p-6" style={{ transform: 'none' }}>
              <h3 className="font-semibold mb-2">📊 BMI Analysis</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{planData.bmi_analysis}</p>
            </div>
            {planData.exercise_recommendations && (
              <div className="glass-card p-6" style={{ transform: 'none' }}>
                <h3 className="font-semibold mb-3">💡 Exercise Recommendations</h3>
                <ul className="space-y-2">
                  {planData.exercise_recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Check size={14} className="text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeSection === 'workout' && planData.weekly_workout_schedule && (
          <div className="space-y-3 animate-fade-in-up">
            {planData.weekly_workout_schedule.map((day, i) => (
              <WorkoutDayCard key={i} day={day} />
            ))}
          </div>
        )}

        {activeSection === 'breakfast' && planData.breakfast_plan && (
          <MealCard meal={planData.breakfast_plan} title="Breakfast Plan" emoji="🌅" />
        )}

        {activeSection === 'lunch' && planData.lunch_plan && (
          <MealCard meal={planData.lunch_plan} title="Lunch Plan" emoji="☀️" />
        )}

        {activeSection === 'dinner' && planData.dinner_plan && (
          <MealCard meal={planData.dinner_plan} title="Dinner Plan" emoji="🌙" />
        )}

        {activeSection === 'snacks' && planData.snacks_recommendations && (
          <div className="glass-card p-6 animate-fade-in-up" style={{ transform: 'none' }}>
            <h3 className="font-semibold mb-4">🍎 Snack Recommendations</h3>
            <ul className="space-y-3">
              {planData.snacks_recommendations.map((snack, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-warning)]/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--color-warning)]">
                    {i + 1}
                  </span>
                  {snack}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'recovery' && planData.recovery_suggestions && (
          <div className="glass-card p-6 animate-fade-in-up" style={{ transform: 'none' }}>
            <h3 className="font-semibold mb-4">💚 Recovery Suggestions</h3>
            <ul className="space-y-3">
              {planData.recovery_suggestions.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Heart size={14} className="text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modification Modal */}
      {showModModal && modifications && (
        <div className="modal-overlay" onClick={() => setShowModModal(false)}>
          <div className="glass-card max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Review Proposed Changes</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">{modSummary}</p>

            <div className="space-y-6">
              {modifications.map((mod, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <h3 className="font-semibold text-sm mb-1 capitalize">{mod.section.replace(/_/g, ' ')}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{mod.reason}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="badge badge-danger text-xs mb-2 inline-block">Current</span>
                      <pre className="text-xs p-3 rounded-lg overflow-auto max-h-40" style={{ background: 'var(--color-surface-light)' }}>
                        {typeof mod.current_value === 'string' ? mod.current_value : JSON.stringify(mod.current_value, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="badge badge-success text-xs mb-2 inline-block">Proposed</span>
                      <pre className="text-xs p-3 rounded-lg overflow-auto max-h-40" style={{ background: 'var(--color-surface-light)' }}>
                        {typeof mod.proposed_value === 'string' ? mod.proposed_value : JSON.stringify(mod.proposed_value, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleApplyModifications} disabled={applyingMod} className="btn-primary flex-1 justify-center">
                {applyingMod ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Approve Changes
              </button>
              <button onClick={() => { setShowModModal(false); setModifications(null); }} className="btn-danger flex-1 justify-center">
                <X size={16} />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutDayCard({ day }: { day: FitnessPlanData['weekly_workout_schedule'][0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card overflow-hidden" style={{ transform: 'none' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-surface-light)]/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${day.rest_day ? 'bg-[var(--color-success)]/15' : 'bg-[var(--color-primary)]/15'}`}>
            {day.rest_day ? (
              <Heart size={18} className="text-[var(--color-success)]" />
            ) : (
              <Dumbbell size={18} className="text-[var(--color-primary-light)]" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm">{day.day}</h4>
            <p className="text-xs text-[var(--color-text-muted)]">{day.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {day.rest_day && <span className="badge badge-success text-xs">Rest Day</span>}
          {!day.rest_day && <span className="text-xs text-[var(--color-text-muted)]">{day.exercises?.length || 0} exercises</span>}
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {expanded && !day.rest_day && day.exercises && (
        <div className="px-4 pb-4">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--color-surface-light)' }}>
                  <th className="text-left p-3 text-xs font-medium text-[var(--color-text-muted)]">Exercise</th>
                  <th className="text-center p-3 text-xs font-medium text-[var(--color-text-muted)]">Sets</th>
                  <th className="text-center p-3 text-xs font-medium text-[var(--color-text-muted)]">Reps</th>
                  <th className="text-left p-3 text-xs font-medium text-[var(--color-text-muted)] hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td className="p-3 font-medium">{ex.name}</td>
                    <td className="p-3 text-center">{ex.sets}</td>
                    <td className="p-3 text-center">{ex.reps}</td>
                    <td className="p-3 text-[var(--color-text-muted)] hidden md:table-cell">{ex.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ meal, title, emoji }: { meal: FitnessPlanData['breakfast_plan']; title: string; emoji: string }) {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ transform: 'none' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{emoji} {title}</h3>
        <span className="badge badge-primary">{meal.total_calories} kcal</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{meal.description}</p>
      {meal.items && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-surface-light)' }}>
                <th className="text-left p-3 text-xs font-medium text-[var(--color-text-muted)]">Item</th>
                <th className="text-center p-3 text-xs font-medium text-[var(--color-text-muted)]">Portion</th>
                <th className="text-center p-3 text-xs font-medium text-[var(--color-text-muted)]">Calories</th>
                <th className="text-center p-3 text-xs font-medium text-[var(--color-text-muted)] hidden md:table-cell">Protein</th>
              </tr>
            </thead>
            <tbody>
              {meal.items.map((item, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 text-center text-[var(--color-text-muted)]">{item.portion}</td>
                  <td className="p-3 text-center">{item.calories}</td>
                  <td className="p-3 text-center text-[var(--color-text-muted)] hidden md:table-cell">{item.protein_g ? `${item.protein_g}g` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
