import { 
  WorkoutSet, 
  saveWorkoutSet, 
  getWorkoutSets, 
  updateWorkoutSet, 
  deleteWorkoutSet,
  getLastUsedValues,
  updateLastUsedValue,
  getTodaysSets
} from './storage';

// Workout management
export const addWorkoutSet = async (set: WorkoutSet): Promise<void> => {
  // Optimistic update: save to storage immediately
  await saveWorkoutSet(set);
  
  // Update last used values for this exercise
  await updateLastUsedValue(set.exercise, set.reps, set.weight);
};

export const updateExistingWorkoutSet = async (set: WorkoutSet): Promise<void> => {
  await updateWorkoutSet(set);
  
  // Update last used values for this exercise
  await updateLastUsedValue(set.exercise, set.reps, set.weight);
};

export const removeWorkoutSet = async (setId: string): Promise<void> => {
  await deleteWorkoutSet(setId);
};

export const getAllWorkoutSets = async (): Promise<WorkoutSet[]> => {
  return await getWorkoutSets();
};

export const getTodaysWorkoutSets = async (): Promise<WorkoutSet[]> => {
  return await getTodaysSets();
};

export const getLastUsedValuesForExercise = async (exerciseName: string): Promise<{ reps: number; weight: number }> => {
  const allValues = await getLastUsedValues();
  return allValues[exerciseName] || { reps: 10, weight: 75 };
};

// Workout statistics
export const getWorkoutStats = async (): Promise<{
  totalSets: number;
  todaysSets: number;
  uniqueExercises: number;
  totalVolume: number;
}> => {
  const allSets = await getAllWorkoutSets();
  const todaysSets = await getTodaysWorkoutSets();
  
  const uniqueExercises = new Set(allSets.map(set => set.exercise)).size;
  const totalVolume = allSets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
  
  return {
    totalSets: allSets.length,
    todaysSets: todaysSets.length,
    uniqueExercises,
    totalVolume,
  };
};

// Get sets by exercise
export const getSetsByExercise = async (exerciseName: string): Promise<WorkoutSet[]> => {
  const sets = await getAllWorkoutSets();
  return sets.filter(set => set.exercise === exerciseName);
};

// Get recent sets (last 7 days)
export const getRecentSets = async (days: number = 7): Promise<WorkoutSet[]> => {
  const sets = await getAllWorkoutSets();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return sets.filter(set => new Date(set.timestamp) >= cutoffDate);
};

// Get exercise progress
export const getExerciseProgress = async (exerciseName: string): Promise<{
  totalSets: number;
  averageReps: number;
  averageWeight: number;
  maxWeight: number;
  lastUsed: Date | null;
}> => {
  const sets = await getSetsByExercise(exerciseName);
  
  if (sets.length === 0) {
    return {
      totalSets: 0,
      averageReps: 0,
      averageWeight: 0,
      maxWeight: 0,
      lastUsed: null,
    };
  }
  
  const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
  const totalWeight = sets.reduce((sum, set) => sum + set.weight, 0);
  const maxWeight = Math.max(...sets.map(set => set.weight));
  const lastUsed = new Date(Math.max(...sets.map(set => new Date(set.timestamp).getTime())));
  
  return {
    totalSets: sets.length,
    averageReps: Math.round(totalReps / sets.length),
    averageWeight: Math.round(totalWeight / sets.length),
    maxWeight,
    lastUsed,
  };
};

// Export types for use in components
export type { WorkoutSet }; 