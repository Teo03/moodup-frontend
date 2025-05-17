// Mood entry type
export interface MoodEntry {
  id: number;
  value: number;
  note: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

// Recommendation item type
export interface Recommendation {
  title: string;
  description: string;
}

// Mood statistics response type
export interface MoodStatistics {
  average_mood: number;
  entries_count: number;
  highest_mood: {
    value: number;
    date: string;
    location?: string;
    factors?: string[];
  };
  lowest_mood: {
    value: number;
    date: string;
    location?: string;
    factors?: string[];
  };
  most_frequent_mood: number;
  ai_mood_analysis?: {
    mood_description: string;
    emotional_state: string;
    mood_insight: string;
    recommendations: Recommendation[];
  };
}

// Weekly mood trend response type
export interface WeeklyMoodTrend {
  dates: string[];
  values: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Mood recommendations response type
export interface MoodRecommendations {
  recommendations: Recommendation[];
  mood_insight: string;
} 