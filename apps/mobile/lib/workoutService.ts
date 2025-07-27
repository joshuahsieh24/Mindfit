import { supabase } from './supabase';
import { WorkoutSet, Exercise, DailyBoost } from './types';

export class WorkoutService {
  // Get today's sets for the current user
  static async getTodaySets(): Promise<WorkoutSet[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('workout_sets')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching today sets:', error);
      return [];
    }

    return data || [];
  }

  // Add a new set
  static async addSet(exercise: string, reps: number, weight: number): Promise<WorkoutSet | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const newSet = {
      exercise,
      reps,
      weight,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('workout_sets')
      .insert(newSet)
      .select()
      .single();

    if (error) {
      console.error('Error adding set:', error);
      return null;
    }

    return data;
  }

  // Get last set for a specific exercise
  static async getLastSetForExercise(exercise: string): Promise<WorkoutSet | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('exercise', exercise)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching last set:', error);
      return null;
    }

    return data;
  }

  // Get available exercises
  static async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }

    return data || [];
  }

  // Get today's daily boost
  static async getDailyBoost(): Promise<DailyBoost | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('daily_boosts')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching daily boost:', error);
      return null;
    }

    return data;
  }
} 