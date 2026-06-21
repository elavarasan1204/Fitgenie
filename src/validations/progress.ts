import { z } from 'zod';

export const progressLogSchema = z.object({
  log_date: z.string().min(1, 'Date is required'),
  weight_kg: z.coerce.number().min(20).max(500).nullable().optional(),
  water_ml: z.coerce.number().min(0).max(20000).nullable().optional(),
  workout_completed: z.boolean().default(false),
  workout_notes: z.string().max(1000).nullable().optional(),
});

export type ProgressLogFormData = z.infer<typeof progressLogSchema>;
