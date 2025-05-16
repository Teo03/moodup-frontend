import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MoodCircle from '../components/MoodCircle';
import MoodRecommendation from '../components/MoodRecommendation';
import MoodInput from '../components/MoodInput';
import { moodApi } from '../services/api';
import { MoodStatistics, WeeklyMoodTrend, MoodRecommendations } from '../types';

const Dashboard: React.FC = () => {
  // State for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
  const [trend, setTrend] = useState<WeeklyMoodTrend | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [statsResponse, trendResponse, recommendationsResponse] = await Promise.all([
          moodApi.getStatistics(),
          moodApi.getWeeklyTrend(),
          moodApi.getRecommendations()
        ]);
        
        setStatistics(statsResponse.data);
        setTrend(trendResponse.data);
        setRecommendations(recommendationsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate mood score as percentage based on average mood (assuming 0-10 scale)
  const moodScore = statistics ? Math.round(statistics.average_mood * 10) : 75;
  
  // Mock data (fallback if API fails)
  const trafficLevel = 60;
  const weatherUv = 45;
  const otherIndicator = 80;
  
  const defaultExplanation = 
    "Your mood score today is based on several factors. The moderate traffic on your commute route might cause some delays, and moderate UV levels suggest fair weather. Other indicators like sleep quality are positive.";
  
  const defaultRecommendationItems = [
    "Take a 10-minute walk during your lunch break to boost your mood further.",
    "Listen to uplifting music during your commute to counteract traffic stress.",
    "Stay hydrated and apply sunscreen due to moderate UV levels today.",
    "Schedule an important meeting for the morning when your energy levels are likely to be highest."
  ];
  
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
      const [statsResponse, trendResponse] = await Promise.all([
        moodApi.getStatistics(),
        moodApi.getWeeklyTrend()
      ]);
      
      setStatistics(statsResponse.data);
      setTrend(trendResponse.data);
    } catch (err) {
      console.error('Error saving mood:', err);
      // You could set an error state here or show a notification
    }
  };

  if (loading) {
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
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="neuro-card">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-purple-600">Today's Mood Prediction</h2>
              <p className="text-sm text-gray-500">Based on your environment and habits</p>
            </div>
            
            <MoodCircle 
              moodScore={moodScore} 
              trafficLevel={trafficLevel}
              weatherUv={weatherUv}
              otherIndicator={otherIndicator}
            />
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Traffic</div>
                <div className="text-lg font-semibold text-purple-500">{trafficLevel}%</div>
              </div>
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Weather (UV)</div>
                <div className="text-lg font-semibold text-green-500">{weatherUv}%</div>
              </div>
              <div className="neuro-inset text-center py-3">
                <div className="text-xs text-gray-500">Sleep</div>
                <div className="text-lg font-semibold text-blue-500">{otherIndicator}%</div>
              </div>
            </div>
            
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
                </div>
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
          <MoodRecommendation 
            explanation={recommendations?.mood_insight || defaultExplanation} 
            recommendations={recommendations?.recommendations.map(r => r.description) || defaultRecommendationItems} 
          />
          
          {trend && (
            <div className="neuro-card mt-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">Weekly Mood Trend</h3>
              <div className="text-sm text-gray-500 mb-4">
                Your mood trend is <span className="font-medium">{trend.trend}</span>
              </div>
              
              <div className="flex items-end justify-between h-36">
                {trend.values.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-purple-400 rounded-t" 
                      style={{height: `${value * 10}%`}}
                    ></div>
                    <div className="text-xs mt-1">{trend.dates[index].split('-')[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 