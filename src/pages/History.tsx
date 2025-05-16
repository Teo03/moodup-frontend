import React from 'react';
import { Link } from 'react-router-dom';
import MoodCalendar from '../components/MoodCalendar';

const History: React.FC = () => {
  // Mock mood history data
  const moodHistory = [
    { date: '2023-10-01', predictedMood: 85, actualMood: 82 },
    { date: '2023-10-02', predictedMood: 75, actualMood: 70 },
    { date: '2023-10-03', predictedMood: 65, actualMood: 60 },
    { date: '2023-10-04', predictedMood: 80, actualMood: 85 },
    { date: '2023-10-05', predictedMood: 70, actualMood: 72 },
    { date: '2023-10-06', predictedMood: 75, actualMood: 74 },
    { date: '2023-10-07', predictedMood: 85, actualMood: 80 },
    { date: '2023-10-08', predictedMood: 90, actualMood: 88 },
    { date: '2023-10-09', predictedMood: 80, actualMood: 75 },
    { date: '2023-10-10', predictedMood: 70, actualMood: 72 },
    { date: '2023-10-11', predictedMood: 65, actualMood: 60 },
    { date: '2023-10-12', predictedMood: 75, actualMood: 80 },
    { date: '2023-10-13', predictedMood: 85, actualMood: 75 },
    { date: '2023-10-14', predictedMood: 70 }, // No actual mood yet
  ];

  // Get current date in the required format
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  // Update mock data to include current date
  const today = `${year}-${month}-${day}`;
  if (!moodHistory.find(entry => entry.date === today)) {
    moodHistory.push({ date: today, predictedMood: 75 });
  }

  // Calculate accuracy between predicted and actual moods
  const moodsWithActual = moodHistory.filter(entry => entry.actualMood !== undefined);
  const accuracySum = moodsWithActual.reduce((sum, entry) => {
    const diff = Math.abs((entry.predictedMood - (entry.actualMood || 0)) / 100);
    return sum + (1 - diff);
  }, 0);
  
  const accuracy = moodsWithActual.length > 0 
    ? Math.round((accuracySum / moodsWithActual.length) * 100) 
    : 0;

  return (
    <div className="neuro-container pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-600">Mood History</h1>
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-semibold">TB</span>
        </div>
      </header>
      
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
          <div className="text-3xl font-bold text-blue-500">
            {Math.round(moodsWithActual.reduce((sum, entry) => sum + (entry.actualMood || 0), 0) / moodsWithActual.length)}
          </div>
        </div>
      </div>
      
      <MoodCalendar moodHistory={moodHistory} />
      
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