export interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  created_at: string;
  user_id?: string;
}

export interface DailyBoost {
  id: string;
  title: string;
  emoji: string;
  message: string;
  verse: string;
  details: string;
  created_at: string;
  user_id?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility';
  created_at: string;
  user_id?: string;
} 