'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/validations/profile';
import { createClient } from '@/lib/supabase/client';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import { toast } from 'sonner';
import { Save, Loader2, Activity } from 'lucide-react';

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

  // Auto-calculate BMI
  useEffect(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (h > 0 && w > 0) {
      const calculatedBmi = calculateBMI(h, w);
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [heightCm, weightKg]);

  // Load existing profile
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
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-[var(--color-text-secondary)]">
          Complete your profile to get personalized AI fitness plans.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">1</span>
            Personal Information
          </h2>
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
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">2</span>
            Body Metrics
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
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
            <div>
              <label className="input-label">BMI (Auto-calculated)</label>
              <div className="input-field flex items-center gap-2" style={{ background: 'var(--color-surface-light)' }}>
                <Activity size={16} className="text-[var(--color-secondary)]" />
                {bmi ? (
                  <span>
                    <strong>{bmi}</strong>
                    <span className="text-xs text-[var(--color-text-muted)] ml-2">({getBMICategory(bmi)})</span>
                  </span>
                ) : (
                  <span className="text-[var(--color-text-muted)]">Enter height & weight</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Goal Selection */}
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">3</span>
            Fitness Goal
          </h2>
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
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">4</span>
            Activity Level
          </h2>
          <div>
            <select {...register('activity_level')} id="activity_level" className="select-field">
              <option value="">Select Activity Level</option>
              {activityLevels.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Diet Preference */}
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">5</span>
            Diet Preference
          </h2>
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
        <div className="glass-card p-6" style={{ transform: 'none' }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs text-white">6</span>
            Medical & Notes
          </h2>
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
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 text-base">
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
