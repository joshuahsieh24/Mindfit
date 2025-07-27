import { Exercise, saveExercise, getExercises, updateExercise, deleteExercise } from './storage';

// Default exercises
const DEFAULT_EXERCISES: Omit<Exercise, 'id' | 'createdAt'>[] = [
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Squats', category: 'Legs' },
  { name: 'Deadlift', category: 'Back' },
  { name: 'Pull-ups', category: 'Back' },
  { name: 'Push-ups', category: 'Chest' },
  { name: 'Lunges', category: 'Legs' },
  { name: 'Shoulder Press', category: 'Shoulders' },
  { name: 'Bicep Curls', category: 'Arms' },
  { name: 'Tricep Dips', category: 'Arms' },
  { name: 'Planks', category: 'Core' },
  { name: 'Crunches', category: 'Core' },
  { name: 'Lateral Raises', category: 'Shoulders' },
  { name: 'Hip Thrust', category: 'Legs' },
  { name: 'Romanian Deadlift', category: 'Back' },
  { name: 'Incline Bench Press', category: 'Chest' },
  { name: 'Decline Push-ups', category: 'Chest' },
];

export const MUSCLE_CATEGORIES = [
  'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'
] as const;

export type MuscleCategory = typeof MUSCLE_CATEGORIES[number];

// Initialize default exercises if none exist
export const initializeDefaultExercises = async (): Promise<void> => {
  const existingExercises = await getExercises();
  
  if (existingExercises.length === 0) {
    const defaultExercises: Exercise[] = DEFAULT_EXERCISES.map(exercise => ({
      ...exercise,
      id: `default_${exercise.name.toLowerCase().replace(/\s+/g, '_')}`,
      createdAt: new Date(),
    }));
    
    for (const exercise of defaultExercises) {
      await saveExercise(exercise);
    }
  }
};

// Get all exercises
export const getAllExercises = async (): Promise<Exercise[]> => {
  await initializeDefaultExercises();
  return await getExercises();
};

// Get exercises by category
export const getExercisesByCategory = async (category: MuscleCategory): Promise<Exercise[]> => {
  const exercises = await getAllExercises();
  return exercises.filter(exercise => exercise.category === category);
};

// Add new exercise
export const addNewExercise = async (name: string, category: MuscleCategory): Promise<Exercise> => {
  const newExercise: Exercise = {
    id: `custom_${Date.now()}`,
    name: name.trim(),
    category,
    createdAt: new Date(),
  };
  
  await saveExercise(newExercise);
  return newExercise;
};

// Update exercise
export const updateExistingExercise = async (exercise: Exercise): Promise<void> => {
  await updateExercise(exercise);
};

// Delete exercise
export const removeExercise = async (exerciseId: string): Promise<void> => {
  await deleteExercise(exerciseId);
};

// Search exercises
export const searchExercises = async (query: string): Promise<Exercise[]> => {
  const exercises = await getAllExercises();
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return exercises;
  
  return exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm) ||
    exercise.category.toLowerCase().includes(searchTerm)
  );
};

// Get exercise by name
export const getExerciseByName = async (name: string): Promise<Exercise | null> => {
  const exercises = await getAllExercises();
  return exercises.find(exercise => exercise.name.toLowerCase() === name.toLowerCase()) || null;
};

// Check if exercise exists
export const exerciseExists = async (name: string): Promise<boolean> => {
  const exercise = await getExerciseByName(name);
  return exercise !== null;
}; 