// Mood entry type
export interface MoodEntry {
  id: number;
  value: number;
  note: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Mood statistics response type
export interface MoodStatistics {
  average_mood: number;
  entries_count: number;
  highest_mood: {
    value: number;
    date: string;
  };
  lowest_mood: {
    value: number;
    date: string;
  };
  most_frequent_mood: number;
}

// Weekly mood trend response type
export interface WeeklyMoodTrend {
  dates: string[];
  values: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Recommendation item type
export interface Recommendation {
  type: string;
  title: string;
  description: string;
  benefit: string;
}

// Mood recommendations response type
export interface MoodRecommendations {
  recommendations: Recommendation[];
  mood_insight: string;
} 