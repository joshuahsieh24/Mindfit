import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  EXERCISES: 'mindfit_exercises',
  WORKOUT_SETS: 'mindfit_workout_sets',
  LAST_USED_VALUES: 'mindfit_last_used_values',
} as const;

// Types
export interface Exercise {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
}

export interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  timestamp: Date;
}

export interface LastUsedValues {
  [exerciseName: string]: {
    reps: number;
    weight: number;
  };
}

// Generic storage functions
const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
};

// Exercise storage
export const getExercises = async (): Promise<Exercise[]> => {
  const exercises = await getItem<Exercise[]>(STORAGE_KEYS.EXERCISES);
  return exercises || [];
};

export const saveExercise = async (exercise: Exercise): Promise<void> => {
  const exercises = await getExercises();
  const updatedExercises = [...exercises, exercise];
  await setItem(STORAGE_KEYS.EXERCISES, updatedExercises);
};

export const updateExercise = async (exercise: Exercise): Promise<void> => {
  const exercises = await getExercises();
  const updatedExercises = exercises.map(ex => 
    ex.id === exercise.id ? exercise : ex
  );
  await setItem(STORAGE_KEYS.EXERCISES, updatedExercises);
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  const exercises = await getExercises();
  const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
  await setItem(STORAGE_KEYS.EXERCISES, updatedExercises);
};

// Workout sets storage
export const getWorkoutSets = async (): Promise<WorkoutSet[]> => {
  const sets = await getItem<WorkoutSet[]>(STORAGE_KEYS.WORKOUT_SETS);
  return sets || [];
};

export const saveWorkoutSet = async (set: WorkoutSet): Promise<void> => {
  const sets = await getWorkoutSets();
  const updatedSets = [set, ...sets];
  await setItem(STORAGE_KEYS.WORKOUT_SETS, updatedSets);
};

export const updateWorkoutSet = async (set: WorkoutSet): Promise<void> => {
  const sets = await getWorkoutSets();
  const updatedSets = sets.map(s => s.id === set.id ? set : s);
  await setItem(STORAGE_KEYS.WORKOUT_SETS, updatedSets);
};

export const deleteWorkoutSet = async (setId: string): Promise<void> => {
  const sets = await getWorkoutSets();
  const updatedSets = sets.filter(s => s.id !== setId);
  await setItem(STORAGE_KEYS.WORKOUT_SETS, updatedSets);
};

// Last used values storage
export const getLastUsedValues = async (): Promise<LastUsedValues> => {
  const values = await getItem<LastUsedValues>(STORAGE_KEYS.LAST_USED_VALUES);
  return values || {};
};

export const saveLastUsedValues = async (values: LastUsedValues): Promise<void> => {
  await setItem(STORAGE_KEYS.LAST_USED_VALUES, values);
};

export const updateLastUsedValue = async (
  exerciseName: string, 
  reps: number, 
  weight: number
): Promise<void> => {
  const values = await getLastUsedValues();
  const updatedValues = {
    ...values,
    [exerciseName]: { reps, weight }
  };
  await saveLastUsedValues(updatedValues);
};

// Utility functions
export const getTodaysSets = async (): Promise<WorkoutSet[]> => {
  const sets = await getWorkoutSets();
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  
  return sets.filter(set => {
    const setDate = new Date(set.timestamp);
    return setDate >= startOfDay && setDate < endOfDay;
  });
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}; 