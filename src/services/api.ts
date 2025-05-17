import axios from 'axios';
import { Location } from '../types';

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
  
  // Get mood statistics and recommendations
  getStatistics: (location?: Location) => {
    let url = 'statistics/';
    
    // Add location parameters if available
    if (location) {
      const params = new URLSearchParams();
      params.append('lat', location.latitude.toString());
      params.append('lon', location.longitude.toString());
      if (location.name) {
        params.append('location_name', location.name);
      }
      url += `?${params.toString()}`;
    }
    
    return apiClient.get(url);
  }
};

export default apiClient; 