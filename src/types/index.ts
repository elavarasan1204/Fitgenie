export interface Profile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  goal: string | null;
  custom_goal: string | null;
  activity_level: string | null;
  diet_preference: string | null;
  custom_diet: string | null;
  medical_conditions: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FitnessPlan {
  id: string;
  user_id: string;
  plan_data: FitnessPlanData;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgressLog {
  id: string;
  user_id: string;
  log_date: string;
  weight_kg: number | null;
  water_ml: number | null;
  workout_completed: boolean;
  workout_notes: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface FitnessPlanData {
  user_summary: string;
  goal_summary: string;
  bmi_analysis: string;
  daily_calorie_target: number;
  water_intake_target: number;
  weekly_workout_schedule: WorkoutDay[];
  exercise_recommendations: string[];
  breakfast_plan: MealPlan;
  lunch_plan: MealPlan;
  dinner_plan: MealPlan;
  snacks_recommendations: string[];
  recovery_suggestions: string[];
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  rest_day: boolean;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration_minutes?: number;
  notes?: string;
}

export interface MealPlan {
  description: string;
  items: MealItem[];
  total_calories: number;
}

export interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface PlanModification {
  section: string;
  current_value: unknown;
  proposed_value: unknown;
  reason: string;
}
