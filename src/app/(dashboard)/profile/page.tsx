'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/validations/profile';
import { createClient } from '@/lib/supabase/client';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import { toast } from 'sonner';
import { Save, Loader2, Activity, User, Scale, Target, Utensils, Heart, FileText } from 'lucide-react';

const goalOptions = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'general_fitness', label: 'General Fitness' },
  { value: 'strength_training', label: 'Strength Training' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'custom', label: 'Custom Goal' },
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (6-7 days/week)' },
  { value: 'athlete', label: 'Athlete (2x per day)' },
];

const dietOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'custom', label: 'Custom' },
];

interface ProfileFormValues {
  full_name: string;
  age: number | string | null;
  gender: string;
  height_cm: number | string | null;
  weight_kg: number | string | null;
  goal: string;
  custom_goal?: string | null;
  activity_level: string;
  diet_preference: string;
  custom_diet?: string | null;
  medical_conditions?: string | null;
  additional_notes?: string | null;
}

function BMIRing({ bmi }: { bmi: number | null }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const maxBmi = 40;
  const progress = bmi ? Math.min(bmi / maxBmi, 1) : 0;
  const dashoffset = circumference * (1 - progress);

  const getColor = (b: number) => {
    if (b < 18.5) return '#22D3EE';
    if (b < 25) return '#22C55E';
    if (b < 30) return '#F59E0B';
    return '#EF4444';
  };

  const color = bmi ? getColor(bmi) : '#7C849A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Track */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 65 65)"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        {/* Center text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {bmi ? (
            <>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: color, lineHeight: 1 }}>{bmi}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7C849A', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BMI</span>
            </>
          ) : (
            <>
              <Activity size={20} style={{ color: '#7C849A' }} />
              <span style={{ fontSize: '0.6rem', color: '#7C849A', marginTop: '4px' }}>BMI</span>
            </>
          )}
        </div>
      </div>
      {bmi && (
        <div
          style={{
            padding: '4px 14px',
            borderRadius: '20px',
            background: `${color}18`,
            border: `1px solid ${color}30`,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: color,
            letterSpacing: '0.04em',
          }}
        >
          {getBMICategory(bmi)}
        </div>
      )}
    </div>
  );
}

const sectionStyle = {
  background: 'rgba(14, 20, 40, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  padding: '28px',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

function SectionHeader({ number, icon: Icon, title }: { number: number; icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(91,140,255,0.3)',
        }}
      >
        <Icon size={15} className="text-white" />
      </div>
      <div>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7C849A' }}>
          Step {number}
        </p>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '1px' }}>{title}</h2>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bmi, setBmi] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
  });

  const heightCm = watch('height_cm');
  const weightKg = watch('weight_kg');
  const selectedGoal = watch('goal');
  const selectedDiet = watch('diet_preference');

  useEffect(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (h > 0 && w > 0) {
      setBmi(calculateBMI(h, w));
    } else {
      setBmi(null);
    }
  }, [heightCm, weightKg]);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        reset({
          full_name: profile.full_name || '',
          age: profile.age,
          gender: profile.gender,
          height_cm: profile.height_cm,
          weight_kg: profile.weight_kg,
          goal: profile.goal,
          custom_goal: profile.custom_goal,
          activity_level: profile.activity_level,
          diet_preference: profile.diet_preference,
          custom_diet: profile.custom_diet,
          medical_conditions: profile.medical_conditions,
          additional_notes: profile.additional_notes,
        });
      }
      setFetching(false);
    };
    loadProfile();
  }, [reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Not authenticated'); return; }

      const calculatedBmi = data.height_cm && data.weight_kg
        ? calculateBMI(Number(data.height_cm), Number(data.weight_kg))
        : null;

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          bmi: calculatedBmi,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #5B8CFF 0%, #7B61FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 24px rgba(91,140,255,0.3)',
            }}
          >
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
          <p style={{ color: '#7C849A', fontSize: '0.875rem' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: '#FFFFFF' }}>
          Your Profile
        </h1>
        <p className="text-sm" style={{ color: '#7C849A' }}>
          Complete your profile to get personalized AI fitness plans.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Personal Information */}
        <div style={sectionStyle}>
          <SectionHeader number={1} icon={User} title="Personal Information" />
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="full_name" className="input-label">Full Name</label>
              <input {...register('full_name')} id="full_name" type="text" className={`input-field ${errors.full_name ? 'input-error' : ''}`} placeholder="John Doe" />
              {errors.full_name && <p className="error-message">{errors.full_name.message}</p>}
            </div>
            <div>
              <label htmlFor="age" className="input-label">Age</label>
              <input {...register('age')} id="age" type="number" className={`input-field ${errors.age ? 'input-error' : ''}`} placeholder="25" />
              {errors.age && <p className="error-message">{errors.age.message}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="input-label">Gender</label>
              <select {...register('gender')} id="gender" className={`select-field ${errors.gender ? 'input-error' : ''}`}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Metrics */}
        <div style={sectionStyle}>
          <SectionHeader number={2} icon={Scale} title="Body Metrics" />
          <div className="grid md:grid-cols-3 gap-5 items-start">
            <div>
              <label htmlFor="height_cm" className="input-label">Height (cm)</label>
              <input {...register('height_cm')} id="height_cm" type="number" step="0.1" className={`input-field ${errors.height_cm ? 'input-error' : ''}`} placeholder="170" />
              {errors.height_cm && <p className="error-message">{errors.height_cm.message}</p>}
            </div>
            <div>
              <label htmlFor="weight_kg" className="input-label">Weight (kg)</label>
              <input {...register('weight_kg')} id="weight_kg" type="number" step="0.1" className={`input-field ${errors.weight_kg ? 'input-error' : ''}`} placeholder="70" />
              {errors.weight_kg && <p className="error-message">{errors.weight_kg.message}</p>}
            </div>
            <div className="flex flex-col items-center pt-1">
              <p className="input-label mb-3 self-start">BMI (Auto-calculated)</p>
              <BMIRing bmi={bmi} />
            </div>
          </div>
        </div>

        {/* Fitness Goal */}
        <div style={sectionStyle}>
          <SectionHeader number={3} icon={Target} title="Fitness Goal" />
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="goal" className="input-label">Goal</label>
              <select {...register('goal')} id="goal" className="select-field">
                <option value="">Select Goal</option>
                {goalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {selectedGoal === 'custom' && (
              <div>
                <label htmlFor="custom_goal" className="input-label">Custom Goal</label>
                <input {...register('custom_goal')} id="custom_goal" type="text" className="input-field" placeholder="Describe your custom goal" />
              </div>
            )}
          </div>
        </div>

        {/* Activity Level */}
        <div style={sectionStyle}>
          <SectionHeader number={4} icon={Activity} title="Activity Level" />
          <select {...register('activity_level')} id="activity_level" className="select-field">
            <option value="">Select Activity Level</option>
            {activityLevels.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Diet Preference */}
        <div style={sectionStyle}>
          <SectionHeader number={5} icon={Utensils} title="Diet Preference" />
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <select {...register('diet_preference')} id="diet_preference" className="select-field">
                <option value="">Select Diet Preference</option>
                {dietOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {selectedDiet === 'custom' && (
              <div>
                <label htmlFor="custom_diet" className="input-label">Custom Diet</label>
                <input {...register('custom_diet')} id="custom_diet" type="text" className="input-field" placeholder="Describe your diet preference" />
              </div>
            )}
          </div>
        </div>

        {/* Medical & Notes */}
        <div style={sectionStyle}>
          <SectionHeader number={6} icon={Heart} title="Medical & Notes" />
          <div className="space-y-5">
            <div>
              <label htmlFor="medical_conditions" className="input-label">Medical Conditions</label>
              <textarea {...register('medical_conditions')} id="medical_conditions" className="textarea-field" placeholder="Any medical conditions, injuries, or health considerations..." rows={3} />
            </div>
            <div>
              <label htmlFor="additional_notes" className="input-label">Additional Notes</label>
              <textarea {...register('additional_notes')} id="additional_notes" className="textarea-field" placeholder="Any other preferences or information you'd like to share..." rows={3} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
          style={{ padding: '16px 28px', fontSize: '0.95rem' }}
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
