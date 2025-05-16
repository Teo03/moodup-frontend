import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MoodCalendar from '../components/MoodCalendar';
import { moodApi } from '../services/api';
import { MoodEntry } from '../types';

interface ProcessedMoodEntry {
  date: string;
  predictedMood: number;
  actualMood?: number;
}

// Update the MoodCalendar component's expected prop type
interface MoodCalendarProps {
  moodHistory: ProcessedMoodEntry[];
}

// We're assuming MoodCalendar accepts this prop type now
const MoodCalendarWithProps = MoodCalendar as React.FC<MoodCalendarProps>;

const History: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<ProcessedMoodEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch mood entries and trend data
        const [moodsResponse, trendResponse] = await Promise.all([
          moodApi.getAll(),
          moodApi.getWeeklyTrend()
        ]);
        
        // Process mood entries
        const moodEntries: MoodEntry[] = moodsResponse.data;
        
        // Create the processed history data
        const processedHistory: ProcessedMoodEntry[] = moodEntries.map(entry => ({
          date: entry.date,
          actualMood: entry.value * 10, // Convert 0-10 scale to 0-100 for UI consistency
          predictedMood: 75 // Default value
        }));
        
        // Add prediction data from trend if available
        if (trendResponse.data.dates && trendResponse.data.values) {
          trendResponse.data.dates.forEach((date: string, index: number) => {
            const existingEntry = processedHistory.find(entry => entry.date === date);
            const predictedValue = trendResponse.data.values[index] * 10; // Convert 0-10 scale to 0-100
            
            if (existingEntry) {
              existingEntry.predictedMood = predictedValue;
            } else {
              processedHistory.push({
                date,
                predictedMood: predictedValue
              });
            }
          });
        }
        
        // Get current date and add it if not already present
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        
        if (!processedHistory.find(entry => entry.date === today)) {
          processedHistory.push({ date: today, predictedMood: 75 });
        }
        
        setMoodHistory(processedHistory);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood history:', err);
        setError('Failed to load mood history. Please try again later.');
        
        // Use mock data as fallback
        setMoodHistory([
          { date: '2023-10-01', predictedMood: 85, actualMood: 82 },
          { date: '2023-10-02', predictedMood: 75, actualMood: 70 },
          { date: today, predictedMood: 75 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get current date in the required format for fallback
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  // Calculate accuracy between predicted and actual moods
  const moodsWithActual = moodHistory.filter(entry => entry.actualMood !== undefined);
  const accuracySum = moodsWithActual.reduce((sum, entry) => {
    const diff = Math.abs((entry.predictedMood - (entry.actualMood || 0)) / 100);
    return sum + (1 - diff);
  }, 0);
  
  const accuracy = moodsWithActual.length > 0 
    ? Math.round((accuracySum / moodsWithActual.length) * 100) 
    : 0;
    
  // Calculate average mood
  const moodsWithActualValue = moodHistory.filter(entry => entry.actualMood !== undefined);
  const averageMood = moodsWithActualValue.length > 0
    ? Math.round(moodsWithActualValue.reduce((sum, entry) => sum + (entry.actualMood || 0), 0) / moodsWithActualValue.length)
    : 0;

  if (loading) {
    return <div className="neuro-container flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="neuro-container pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-600">Mood History</h1>
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-semibold">TB</span>
        </div>
      </header>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-purple-600">{moodHistory.length}</div>
        </div>
        
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Prediction Accuracy</div>
          <div className="text-3xl font-bold text-green-500">{accuracy}%</div>
        </div>
        
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Average Mood</div>
          <div className="text-3xl font-bold text-blue-500">{averageMood}</div>
        </div>
      </div>
      
      <MoodCalendarWithProps moodHistory={moodHistory} />
      
      <div className="mt-6 neuro-card">
        <h3 className="text-lg font-semibold mb-4 text-purple-500">Recent Mood History</h3>
        
        <div className="space-y-3">
          {moodHistory.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="neuro-inset p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Predicted: {entry.predictedMood} | 
                  {entry.actualMood 
                    ? ` Actual: ${entry.actualMood}` 
                    : ' Awaiting your input'}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs
                  ${entry.predictedMood >= 80 ? 'bg-green-500' : 
                    entry.predictedMood >= 60 ? 'bg-blue-500' : 
                    entry.predictedMood >= 40 ? 'bg-yellow-500' : 
                    entry.predictedMood >= 20 ? 'bg-orange-500' : 'bg-red-500'}`}
                >
                  P
                </div>
                
                {entry.actualMood && (
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs
                    ${entry.actualMood >= 80 ? 'bg-green-500' : 
                      entry.actualMood >= 60 ? 'bg-blue-500' : 
                      entry.actualMood >= 40 ? 'bg-yellow-500' : 
                      entry.actualMood >= 20 ? 'bg-orange-500' : 'bg-red-500'}`}
                  >
                    A
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Link to="/" className="neuro-button text-purple-600 inline-flex items-center">
          <span className="material-icons mr-2 text-sm">dashboard</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default History; 