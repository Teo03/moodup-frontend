import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MoodCircle from '../components/MoodCircle';
import MoodRecommendation from '../components/MoodRecommendation';
import MoodInput from '../components/MoodInput';
import { moodApi } from '../services/api';
import useLocation from '../services/useLocation';
import { MoodStatistics } from '../types';

// AI Mood Analysis Component
const AIMoodAnalysis = ({ moodAnalysis }: { moodAnalysis: MoodStatistics['ai_mood_analysis'] }) => {
  if (!moodAnalysis) return null;
  
  return (
    <div className="neuro-card mb-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-purple-600 mb-3">AI Mood Analysis</h3>
      
      <div className="mb-4">
        <p className="text-gray-700">{moodAnalysis.mood_description}</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="neuro-inset py-2 px-4 text-sm">
          <span className="text-purple-500 font-medium">Emotional State: </span>
          <span className="capitalize">{moodAnalysis.emotional_state}</span>
        </div>
        
        <div className="neuro-inset py-2 px-4 text-sm flex-1">
          <span className="text-green-500 font-medium">Insight: </span>
          <span>{moodAnalysis.mood_insight}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // State for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
  
  // Get user's location
  const { location, loading: locationLoading, error: locationError } = useLocation();
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch mood statistics with location data
        const statsResponse = await moodApi.getStatistics(location || undefined);
        setStatistics(statsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch data when location data is available or location loading has failed
    if (!locationLoading) {
      fetchData();
    }
  }, [location, locationLoading]);
  
  // Calculate mood score as percentage based on average mood (assuming 0-10 scale)
  const moodScore = statistics ? Math.round(statistics.average_mood * 10) : 75;
  
  const handleMoodSelect = async (mood: number) => {
    console.log('Selected mood:', mood);
    
    try {
      // Send mood to API
      await moodApi.create({
        value: mood,
        note: '',
        date: new Date().toISOString().split('T')[0]  // Format: YYYY-MM-DD
      });
      
      // Refresh the dashboard data after submitting a new mood
      const statsResponse = await moodApi.getStatistics(location || undefined);
      setStatistics(statsResponse.data);
    } catch (err) {
      console.error('Error saving mood:', err);
      // You could set an error state here or show a notification
    }
  };

  if (loading || locationLoading) {
    return <div className="neuro-container flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="neuro-container pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-600">MoodUp</h1>
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-semibold">TB</span>
        </div>
      </header>
      
      {(error || locationError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error || locationError}
        </div>
      )}
      
      {location && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="material-icons text-sm align-text-top mr-1">location_on</span>
          Location: {location.name || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="neuro-card">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-purple-600">Today's Mood Prediction</h2>
              <p className="text-sm text-gray-500">Based on your environment and location</p>
            </div>
            
            <MoodCircle 
              moodScore={moodScore} 
              factors={statistics?.highest_mood?.factors}
            />
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Weather</div>
                <div className="text-lg font-semibold text-purple-500">Impact</div>
              </div>
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-lg font-semibold text-green-500">{statistics?.highest_mood?.location || 'Unknown'}</div>
              </div>
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-lg font-semibold text-blue-500">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
            </div>

                  
            {/* AI Mood Analysis */}
            {statistics?.ai_mood_analysis && (
              <AIMoodAnalysis moodAnalysis={statistics.ai_mood_analysis} />
            )}
            
            {statistics && (
              <div className="mt-6 p-4 neuro-inset">
                <h3 className="text-md font-semibold text-purple-600 mb-2">Your Mood Stats</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Average Mood:</div>
                  <div className="font-medium">{statistics.average_mood}/10</div>
                  <div>Total Entries:</div>
                  <div className="font-medium">{statistics.entries_count}</div>
                  <div>Most Frequent:</div>
                  <div className="font-medium">{statistics.most_frequent_mood}/10</div>
                  {statistics.highest_mood.location && (
                    <>
                      <div>Best Location:</div>
                      <div className="font-medium">{statistics.highest_mood.location}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {statistics?.highest_mood?.factors && (
              <div className="mt-4 p-4 neuro-inset">
                <h3 className="text-md font-semibold text-purple-600 mb-2">Mood Factors</h3>
                <ul className="text-sm list-disc pl-5">
                  {statistics.highest_mood.factors.map((factor, index) => (
                    <li key={index} className="mb-1">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <MoodInput onMoodSelect={handleMoodSelect} />
          
          <div className="mt-6 text-center">
            <Link to="/history" className="neuro-button inline-flex items-center text-purple-600">
              <span className="material-icons mr-2 text-sm">history</span>
              View Mood History
            </Link>
          </div>
        </div>
        
        <div>
          {/* Use recommendations from AI analysis */}
          {statistics?.ai_mood_analysis?.recommendations && (
            <MoodRecommendation 
              moodInsight={statistics.ai_mood_analysis.mood_insight}
              recommendations={statistics.ai_mood_analysis.recommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 