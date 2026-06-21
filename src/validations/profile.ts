import { z } from 'zod';

const numericField = (min: number, max: number, minMsg: string, maxMsg: string) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().min(min, minMsg).max(max, maxMsg).nullable().optional()
  );

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: numericField(10, 120, 'Age must be at least 10', 'Age must be at most 120'),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  height_cm: numericField(50, 300, 'Height must be at least 50 cm', 'Height must be at most 300 cm'),
  weight_kg: numericField(20, 500, 'Weight must be at least 20 kg', 'Weight must be at most 500 kg'),
  goal: z.enum([
    'weight_loss', 'weight_gain', 'fat_loss', 'muscle_gain',
    'general_fitness', 'strength_training', 'endurance', 'custom'
  ]).nullable().optional(),
  custom_goal: z.string().max(500).nullable().optional(),
  activity_level: z.enum([
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'
  ]).nullable().optional(),
  diet_preference: z.enum(['vegetarian', 'non_vegetarian', 'vegan', 'custom']).nullable().optional(),
  custom_diet: z.string().max(500).nullable().optional(),
  medical_conditions: z.string().max(2000).nullable().optional(),
  additional_notes: z.string().max(2000).nullable().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
