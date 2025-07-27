import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NutritionGoal {
  id?: string;
  userId?: string;
  date: string;
  metGoal: boolean;
  waterCups: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NutritionGoalInput {
  date: string;
  metGoal: boolean;
  waterCups: number;
  note?: string;
}

// Cache nutrition goals in AsyncStorage
const CACHE_KEY_PREFIX = 'nutrition_goal_';

export const getTodayNutritionGoal = async (): Promise<NutritionGoal | null> => {
  try {
    const today = new Date().toDateString();
    const cacheKey = `${CACHE_KEY_PREFIX}${today}`;
    
    // Try to get from cache first
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, try to get from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found, using local storage only');
      return null;
    }

    const { data, error } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching nutrition goal:', error);
      return null;
    }

    if (data) {
      const goal: NutritionGoal = {
        id: data.id,
        userId: data.user_id,
        date: data.date,
        metGoal: data.met_goal,
        waterCups: data.water_cups,
        note: data.note,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      // Cache the result
      await AsyncStorage.setItem(cacheKey, JSON.stringify(goal));
      return goal;
    }

    return null;
  } catch (error) {
    console.error('Error in getTodayNutritionGoal:', error);
    return null;
  }
};

export const upsertNutritionGoal = async (goal: NutritionGoalInput): Promise<NutritionGoal | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found, saving to local storage only');
      // Save to local storage only
      const localGoal: NutritionGoal = {
        date: goal.date,
        metGoal: goal.metGoal,
        waterCups: goal.waterCups,
        note: goal.note,
      };
      
      const cacheKey = `${CACHE_KEY_PREFIX}${goal.date}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(localGoal));
      return localGoal;
    }

    // Upsert to Supabase
    const { data, error } = await supabase
      .from('nutrition_goals')
      .upsert({
        user_id: user.id,
        date: goal.date,
        met_goal: goal.metGoal,
        water_cups: goal.waterCups,
        note: goal.note,
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting nutrition goal:', error);
      return null;
    }

    const result: NutritionGoal = {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      metGoal: data.met_goal,
      waterCups: data.water_cups,
      note: data.note,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Cache the result
    const cacheKey = `${CACHE_KEY_PREFIX}${goal.date}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Error in upsertNutritionGoal:', error);
    return null;
  }
};

export const updateNutritionGoal = async (updates: Partial<NutritionGoalInput>): Promise<NutritionGoal | null> => {
  try {
    const today = new Date().toDateString();
    const currentGoal = await getTodayNutritionGoal();
    
    if (!currentGoal) {
      // Create new goal if none exists
      return await upsertNutritionGoal({
        date: today,
        metGoal: updates.metGoal ?? false,
        waterCups: updates.waterCups ?? 0,
        note: updates.note ?? '',
      });
    }

    // Update existing goal
    const updatedGoal: NutritionGoalInput = {
      date: today,
      metGoal: updates.metGoal ?? currentGoal.metGoal,
      waterCups: updates.waterCups ?? currentGoal.waterCups,
      note: updates.note ?? currentGoal.note,
    };

    return await upsertNutritionGoal(updatedGoal);
  } catch (error) {
    console.error('Error in updateNutritionGoal:', error);
    return null;
  }
};

export const getNutritionGoalsForDateRange = async (startDate: string, endDate: string): Promise<NutritionGoal[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found, cannot fetch from Supabase');
      return [];
    }

    const { data, error } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching nutrition goals:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      date: item.date,
      metGoal: item.met_goal,
      waterCups: item.water_cups,
      note: item.note,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch (error) {
    console.error('Error in getNutritionGoalsForDateRange:', error);
    return [];
  }
};

export const clearNutritionCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const nutritionKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(nutritionKeys);
  } catch (error) {
    console.error('Error clearing nutrition cache:', error);
  }
}; 