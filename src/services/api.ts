import axios from 'axios';

// Set up API base URL - replace with your actual backend URL when deploying
const API_URL = 'http://localhost:8000/api/';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const moodApi = {
  // Fetch all mood entries
  getAll: () => apiClient.get('moods/'),
  
  // Create a new mood entry
  create: (data: any) => apiClient.post('moods/', data),
  
  // Get a specific mood entry
  getById: (id: number) => apiClient.get(`moods/${id}/`),
  
  // Update a mood entry
  update: (id: number, data: any) => apiClient.put(`moods/${id}/`, data),
  
  // Delete a mood entry
  delete: (id: number) => apiClient.delete(`moods/${id}/`),
  
  // Get mood statistics
  getStatistics: () => apiClient.get('statistics/'),
  
  // Get weekly mood trends
  getWeeklyTrend: () => apiClient.get('trends/weekly/'),
  
  // Get mood recommendations
  getRecommendations: () => apiClient.get('recommendations/'),
};

export default apiClient; 