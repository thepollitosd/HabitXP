export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: string;
  difficulty: number;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface XP {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  created_at: string;
  updated_at: string;
}
