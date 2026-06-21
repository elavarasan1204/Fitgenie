-- ============================================================
-- FitGenie AI — Complete Database Schema
-- Run this SQL in Supabase SQL Editor to set up all tables
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- Stores user profile data, body metrics, goals, preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm NUMERIC(5,1),
  weight_kg NUMERIC(5,1),
  bmi NUMERIC(4,1),
  goal TEXT CHECK (goal IN (
    'weight_loss', 'weight_gain', 'fat_loss', 'muscle_gain',
    'general_fitness', 'strength_training', 'endurance', 'custom'
  )),
  custom_goal TEXT,
  activity_level TEXT CHECK (activity_level IN (
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'
  )),
  diet_preference TEXT CHECK (diet_preference IN (
    'vegetarian', 'non_vegetarian', 'vegan', 'custom'
  )),
  custom_diet TEXT,
  medical_conditions TEXT,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- ============================================================
-- 2. FITNESS PLANS TABLE
-- Stores AI-generated fitness plans as JSON
-- ============================================================
CREATE TABLE IF NOT EXISTS fitness_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster plan lookups by user
CREATE INDEX IF NOT EXISTS idx_fitness_plans_user_id ON fitness_plans(user_id);
-- Index to quickly find active plans
CREATE INDEX IF NOT EXISTS idx_fitness_plans_active ON fitness_plans(user_id, is_active) WHERE is_active = TRUE;

-- ============================================================
-- 3. PROGRESS LOGS TABLE
-- Stores daily progress entries (weight, water, workouts)
-- ============================================================
CREATE TABLE IF NOT EXISTS progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,1),
  water_ml INTEGER,
  workout_completed BOOLEAN DEFAULT FALSE,
  workout_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster progress lookups by user and date
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_date ON progress_logs(user_id, log_date DESC);
-- Unique constraint: one log per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_logs_unique_day ON progress_logs(user_id, log_date);

-- ============================================================
-- 4. CHAT HISTORY TABLE
-- Stores AI coach conversation messages
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster chat history lookups
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id, created_at ASC);

-- ============================================================
-- 5. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES — Users can only access their own data
-- ============================================================

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- FITNESS PLANS policies
CREATE POLICY "Users can view their own fitness plans"
  ON fitness_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness plans"
  ON fitness_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness plans"
  ON fitness_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fitness plans"
  ON fitness_plans FOR DELETE
  USING (auth.uid() = user_id);

-- PROGRESS LOGS policies
CREATE POLICY "Users can view their own progress logs"
  ON progress_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress logs"
  ON progress_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress logs"
  ON progress_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress logs"
  ON progress_logs FOR DELETE
  USING (auth.uid() = user_id);

-- CHAT HISTORY policies
CREATE POLICY "Users can view their own chat history"
  ON chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
  ON chat_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. HELPER FUNCTION — Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply auto-update trigger to fitness_plans
CREATE TRIGGER update_fitness_plans_updated_at
  BEFORE UPDATE ON fitness_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 8. HELPER FUNCTION — Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Done! All tables, indexes, RLS, and triggers are set up.
-- ============================================================
