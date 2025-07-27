-- Create tables for MindFit Coach app

-- Users table (handled by Supabase Auth)
-- No need to create users table as Supabase Auth handles this

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility')) DEFAULT 'strength',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Workout sets table
CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise TEXT NOT NULL,
  reps INTEGER NOT NULL CHECK (reps > 0),
  weight DECIMAL(5,2) NOT NULL CHECK (weight >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Daily boosts table
CREATE TABLE IF NOT EXISTS daily_boosts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  message TEXT NOT NULL,
  verse TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_boosts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Exercises: Users can only see their own exercises
CREATE POLICY "Users can view own exercises" ON exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" ON exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises" ON exercises
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises" ON exercises
  FOR DELETE USING (auth.uid() = user_id);

-- Workout sets: Users can only see their own sets
CREATE POLICY "Users can view own workout sets" ON workout_sets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sets" ON workout_sets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sets" ON workout_sets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sets" ON workout_sets
  FOR DELETE USING (auth.uid() = user_id);

-- Daily boosts: Users can only see their own boosts
CREATE POLICY "Users can view own daily boosts" ON daily_boosts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily boosts" ON daily_boosts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily boosts" ON daily_boosts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily boosts" ON daily_boosts
  FOR DELETE USING (auth.uid() = user_id);

-- Insert default exercises
INSERT INTO exercises (name, category) VALUES
  ('Bench Press', 'strength'),
  ('Squat', 'strength'),
  ('Deadlift', 'strength'),
  ('Overhead Press', 'strength'),
  ('Barbell Row', 'strength'),
  ('Pull-ups', 'strength'),
  ('Dips', 'strength'),
  ('Incline Press', 'strength'),
  ('Romanian Deadlift', 'strength')
ON CONFLICT DO NOTHING; 