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

const cardStyle = {
  background: 'rgba(14, 20, 40, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  padding: '24px',
};

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

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

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
      for (const mod of modifications) {
        const key = mod.section as keyof FitnessPlanData;
        if (key in updatedPlanData) {
          (updatedPlanData as Record<string, unknown>)[key] = mod.proposed_value;
        }
      }

      const res = await fetch('/api/fitness-plan/modify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id, updated_plan_data: updatedPlanData }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to apply changes'); return; }

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
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(91,140,255,0.3)' }}>
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
          <p style={{ color: '#7C849A', fontSize: '0.875rem' }}>Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
            boxShadow: '0 16px 48px rgba(91,140,255,0.35)',
          }}
          className="animate-pulse-glow"
        >
          <Sparkles size={44} className="text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight" style={{ color: '#FFFFFF' }}>
          Generate Your AI Fitness Plan
        </h1>
        <p className="max-w-md mb-8 leading-relaxed" style={{ color: '#B8C0D4' }}>
          Complete your profile first, then let AI create a personalized workout and nutrition plan just for you.
        </p>
        <button
          onClick={generatePlan}
          disabled={generating}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1rem' }}
        >
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
    { key: 'workout', label: 'Workout', icon: Calendar },
    { key: 'breakfast', label: 'Breakfast', icon: Coffee },
    { key: 'lunch', label: 'Lunch', icon: Utensils },
    { key: 'dinner', label: 'Dinner', icon: Moon },
    { key: 'snacks', label: 'Snacks', icon: Apple },
    { key: 'recovery', label: 'Recovery', icon: Heart },
  ];

  const planStats = [
    { label: 'Calories/day', value: planData.daily_calorie_target, icon: Flame, gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', glow: 'rgba(245,158,11,0.25)' },
    { label: 'Water (ml/day)', value: planData.water_intake_target, icon: Droplets, gradient: 'linear-gradient(135deg, #22D3EE 0%, #5B8CFF 100%)', glow: 'rgba(34,211,238,0.25)' },
    { label: 'Workout days', value: planData.weekly_workout_schedule?.filter(d => !d.rest_day).length || 0, icon: Dumbbell, gradient: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', glow: 'rgba(91,140,255,0.25)' },
    { label: 'Rest days', value: planData.weekly_workout_schedule?.filter(d => d.rest_day).length || 0, icon: Heart, gradient: 'linear-gradient(135deg, #22C55E 0%, #22D3EE 100%)', glow: 'rgba(34,197,94,0.25)' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>Your Fitness Plan</h1>
          <p className="text-sm mt-1.5" style={{ color: '#7C849A' }}>
            Version {plan.version} · Generated {new Date(plan.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={generatePlan}
          disabled={generating}
          className="btn-secondary"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Regenerate Plan
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {planStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(14, 20, 40, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px',
              padding: '18px',
              textAlign: 'center',
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
                margin: '0 auto 10px',
                boxShadow: `0 6px 18px ${stat.glow}`,
              }}
            >
              <stat.icon size={17} className="text-white" />
            </div>
            <div className="text-xl font-bold" style={{ color: '#FFFFFF' }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#7C849A' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {sections.map((s) => {
          const active = activeSection === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: active ? 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)' : 'rgba(14,20,40,0.6)',
                border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.07)',
                color: active ? '#FFFFFF' : '#7C849A',
                boxShadow: active ? '0 4px 16px rgba(91,140,255,0.3)' : 'none',
                cursor: 'pointer',
              }}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {activeSection === 'overview' && (
          <div className="space-y-4 animate-fade-in-up">
            {[
              { title: '👤 User Summary', content: planData.user_summary },
              { title: '🎯 Goal Summary', content: planData.goal_summary },
              { title: '📊 BMI Analysis', content: planData.bmi_analysis },
            ].map((item) => (
              <div key={item.title} style={cardStyle}>
                <h3 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#B8C0D4' }}>{item.content}</p>
              </div>
            ))}
            {planData.exercise_recommendations && (
              <div style={cardStyle}>
                <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>💡 Exercise Recommendations</h3>
                <ul className="space-y-2.5">
                  {planData.exercise_recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#B8C0D4' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <Check size={11} style={{ color: '#22C55E' }} />
                      </div>
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
          <MealCard meal={planData.breakfast_plan} title="Breakfast Plan" emoji="🌅" color="#F59E0B" />
        )}
        {activeSection === 'lunch' && planData.lunch_plan && (
          <MealCard meal={planData.lunch_plan} title="Lunch Plan" emoji="☀️" color="#22D3EE" />
        )}
        {activeSection === 'dinner' && planData.dinner_plan && (
          <MealCard meal={planData.dinner_plan} title="Dinner Plan" emoji="🌙" color="#7B61FF" />
        )}

        {activeSection === 'snacks' && planData.snacks_recommendations && (
          <div style={cardStyle} className="animate-fade-in-up">
            <h3 className="font-semibold mb-5" style={{ color: '#FFFFFF' }}>🍎 Snack Recommendations</h3>
            <ul className="space-y-3">
              {planData.snacks_recommendations.map((snack, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#B8C0D4' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '7px',
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#F59E0B',
                    }}
                  >
                    {i + 1}
                  </span>
                  {snack}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'recovery' && planData.recovery_suggestions && (
          <div style={cardStyle} className="animate-fade-in-up">
            <h3 className="font-semibold mb-5" style={{ color: '#FFFFFF' }}>💚 Recovery Suggestions</h3>
            <ul className="space-y-3">
              {planData.recovery_suggestions.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#B8C0D4' }}>
                  <Heart size={14} style={{ color: '#22C55E', marginTop: '2px', flexShrink: 0 }} />
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
          <div
            className="modal-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Review Plan Changes</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: '#B8C0D4' }}>{modSummary}</p>

            <div className="space-y-5">
              {modifications.map((mod, i) => (
                <div key={i} style={{ background: 'rgba(5,8,22,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
                  <h3 className="font-semibold text-sm mb-1 capitalize" style={{ color: '#FFFFFF' }}>{mod.section.replace(/_/g, ' ')}</h3>
                  <p className="text-xs mb-3" style={{ color: '#7C849A' }}>{mod.reason}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <span className="badge badge-danger text-xs mb-2 inline-block">Current Value</span>
                      <pre className="text-xs p-3 rounded-xl overflow-auto max-h-40 scrollbar-hide" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', color: '#B8C0D4' }}>
                        {typeof mod.current_value === 'string' ? mod.current_value : JSON.stringify(mod.current_value, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="badge badge-success text-xs mb-2 inline-block">New Value</span>
                      <pre className="text-xs p-3 rounded-xl overflow-auto max-h-40 scrollbar-hide" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', color: '#B8C0D4' }}>
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
                <X size={16} /> Reject
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
    <div
      style={{
        background: 'rgba(14, 20, 40, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${expanded ? 'rgba(91,140,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.03)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: day.rest_day ? 'rgba(34,197,94,0.12)' : 'rgba(91,140,255,0.12)',
              border: `1px solid ${day.rest_day ? 'rgba(34,197,94,0.2)' : 'rgba(91,140,255,0.2)'}`,
            }}
          >
            {day.rest_day
              ? <Heart size={17} style={{ color: '#22C55E' }} />
              : <Dumbbell size={17} style={{ color: '#7BA7FF' }} />
            }
          </div>
          <div>
            <h4 className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{day.day}</h4>
            <p className="text-xs" style={{ color: '#7C849A' }}>{day.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {day.rest_day && <span className="badge badge-success text-xs">Rest Day</span>}
          {!day.rest_day && <span className="text-xs" style={{ color: '#7C849A' }}>{day.exercises?.length || 0} exercises</span>}
          {expanded
            ? <ChevronDown size={15} style={{ color: '#7BA7FF' }} />
            : <ChevronRight size={15} style={{ color: '#7C849A' }} />
          }
        </div>
      </button>

      {expanded && !day.rest_day && day.exercises && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(91,140,255,0.05)' }}>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Exercise</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Sets</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Reps</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: '#7C849A' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3 font-medium text-sm" style={{ color: '#FFFFFF' }}>{ex.name}</td>
                    <td className="p-3 text-center text-sm" style={{ color: '#7BA7FF' }}>{ex.sets}</td>
                    <td className="p-3 text-center text-sm" style={{ color: '#B8C0D4' }}>{ex.reps}</td>
                    <td className="p-3 text-sm hidden md:table-cell" style={{ color: '#7C849A' }}>{ex.notes || '—'}</td>
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

function MealCard({ meal, title, emoji, color }: { meal: FitnessPlanData['breakfast_plan']; title: string; emoji: string; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(14, 20, 40, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
      className="animate-fade-in-up"
    >
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ padding: '24px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ color: '#FFFFFF' }}>{emoji} {title}</h3>
          <span className="badge badge-primary">{meal.total_calories} kcal</span>
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#B8C0D4' }}>{meal.description}</p>
        {meal.items && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Item</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Portion</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#7C849A' }}>Cal</th>
                  <th className="text-center p-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: '#7C849A' }}>Protein</th>
                </tr>
              </thead>
              <tbody>
                {meal.items.map((item, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="p-3 font-medium" style={{ color: '#FFFFFF' }}>{item.name}</td>
                    <td className="p-3 text-center" style={{ color: '#B8C0D4' }}>{item.portion}</td>
                    <td className="p-3 text-center" style={{ color: '#7BA7FF' }}>{item.calories}</td>
                    <td className="p-3 text-center hidden md:table-cell" style={{ color: '#7C849A' }}>{item.protein_g ? `${item.protein_g}g` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
