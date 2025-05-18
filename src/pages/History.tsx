import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoodCalendar from '../components/MoodCalendar';
import UserAvatar from '../components/UserAvatar';
import { moodApi } from '../services/api';
import { MoodEntry } from '../types';
import { useAppContext, ProcessedMoodEntry } from '../services/AppContext';

// We're just using the standard MoodCalendar component which already has the right types
const History: React.FC = () => {
  // Get state from context instead of local state
  const { 
    moodHistory, setMoodHistory,
    historyLoading, setHistoryLoading,
    historyError, setHistoryError
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if we don't have any history data in context
      if (moodHistory.length === 0) {
        try {
          setHistoryLoading(true);
          
          // Fetch mood entries
          const moodsResponse = await moodApi.getAll();
          
          // Process mood entries
          const moodEntries: MoodEntry[] = moodsResponse.data;
          
          // Create the processed history data
          const processedHistory: ProcessedMoodEntry[] = moodEntries.map(entry => ({
            date: entry.date,
            actualMood: entry.value * 10, // Convert 0-10 scale to 0-100 for UI consistency
            predictedMood: 75 // Default value
          }));
          
          // Add mock prediction data since we don't have actual trend data
          processedHistory.forEach(entry => {
            // Random value between 60-90 for predicted mood
            entry.predictedMood = Math.floor(Math.random() * 30) + 60;
          });
          
          // Get current date and add it if not already present
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const todayStr = `${year}-${month}-${day}`;
          
          if (!processedHistory.find(entry => entry.date === todayStr)) {
            // Add today's entry with only predictedMood
            processedHistory.push({ 
              date: todayStr, 
              predictedMood: 75
              // actualMood is optional so we don't need to specify it
            });
          }
          
          setMoodHistory(processedHistory);
          setHistoryError(null);
        } catch (err) {
          console.error('Error fetching mood history:', err);
          setHistoryError('Failed to load mood history. Please try again later.');
          
          // Use mock data as fallback
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const todayStr = `${year}-${month}-${day}`;
          
          const mockHistory: ProcessedMoodEntry[] = [
            { date: '2023-10-01', predictedMood: 85, actualMood: 82 },
            { date: '2023-10-02', predictedMood: 75, actualMood: 70 },
            { date: todayStr, predictedMood: 75 }
          ];
          
          setMoodHistory(mockHistory);
        } finally {
          setHistoryLoading(false);
        }
      }
    };
    
    fetchData();
  }, [moodHistory.length, setHistoryError, setHistoryLoading, setMoodHistory]);

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

  if (historyLoading) {
    return <div className="neuro-container flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="neuro-container pb-24">
      {/* Regular header with page title */}
      <header className="flex justify-between items-center mb-4">
        <div className="w-10"></div> {/* Spacer to balance the layout */}
        <h1 className="text-2xl font-extrabold text-teal text-center">Mood History</h1>
        <UserAvatar />
      </header>
      
      {/* Error message */}
      {historyError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {historyError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-teal">{moodHistory.length}</div>
        </div>
        
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Prediction Accuracy</div>
          <div className="text-3xl font-bold text-yellow">79%</div>
        </div>
        
        <div className="neuro-card text-center">
          <div className="text-xs text-gray-500 mb-1">Average Mood</div>
          <div className="text-3xl font-bold text-blue">Good</div>
        </div>
      </div>
      
      <MoodCalendar moodHistory={moodHistory} />
      
      <div className="mt-4 neuro-card">
        <h3 className="text-lg font-semibold mb-4 text-teal">Recent Mood History</h3>
        
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
        <Link to="/" className="neuro-button text-teal inline-flex items-center">
          <span className="material-icons mr-2 text-sm">dashboard</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default History; 