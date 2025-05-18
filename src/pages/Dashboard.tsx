import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoodCircle from '../components/MoodCircle';
import MoodRecommendation from '../components/MoodRecommendation';
import MoodInput from '../components/MoodInput';
import UserAvatar from '../components/UserAvatar';
import useUserProfile from '../hooks/useUserProfile';
import { moodApi } from '../services/api';
import useLocation from '../services/useLocation';
import { MoodStatistics } from '../types';
import { useAppContext } from '../services/AppContext';

// AI Mood Analysis Component
const AIMoodAnalysis = ({ moodAnalysis, moodScore = 50 }: { moodAnalysis: MoodStatistics['ai_mood_analysis'], moodScore?: number }) => {
  if (!moodAnalysis) return null;
  
  // Get color based on mood score
  const getMoodThemeColor = () => {
    if (moodScore >= 60) return 'text-teal';
    if (moodScore >= 40) return 'text-blue';
    return 'text-red-700';
  };
  
  return (
    <div className="neuro-card mb-4 animate-fade-in">
      <h3 className={`text-lg font-semibold ${getMoodThemeColor()} mb-3`}>AI Mood Analysis ✨</h3>
      
      <div className="mb-4">
        <p className="text-gray-700">{moodAnalysis.mood_description}</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="neuro-inset py-2 px-4 text-sm">
          <span className={`${getMoodThemeColor()} font-medium`}>Emotional State: </span>
          <span className="capitalize">{moodAnalysis.emotional_state}</span>
        </div>
        
        <div className="neuro-inset py-2 px-4 text-sm flex-1">
          <span className={`${moodScore >= 40 ? "text-yellow" : "text-blue"} font-medium`}>Insight: </span>
          <span>{moodAnalysis.mood_insight}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { userSettings } = useUserProfile();
  // Get state from context instead of local state
  const { 
    statistics, setStatistics,
    dashboardLoading, setDashboardLoading,
    dashboardError, setDashboardError
  } = useAppContext();
  
  // Get user's location
  const { location, loading: locationLoading, error: locationError } = useLocation();
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch if we don't already have statistics in context
        if (statistics === null) {
          setDashboardLoading(true);
          
          // Fetch mood statistics with location data
          const statsResponse = await moodApi.getStatistics(location || undefined);
          setStatistics(statsResponse.data);
          
          setDashboardError(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setDashboardError('Failed to load data. Please try again later.');
      } finally {
        setDashboardLoading(false);
      }
    };
    
    // Only fetch data when location data is available or location loading has failed
    if (!locationLoading) {
      fetchData();
    }
  }, [location, locationLoading, setDashboardError, setDashboardLoading, setStatistics]);
  
  // Calculate mood score as percentage based on average mood (assuming 0-10 scale)
  const moodScore = statistics ? Math.round(statistics.average_mood * 10) : 75;
  
  // Get user's first name for personalized greeting
  const firstName = userSettings.name.split(' ')[0] || 'User';

  // Get mood status based on percentage
  const getMoodStatus = () => {
    if (moodScore >= 80) return 'Happy';
    if (moodScore >= 60) return 'Good';
    if (moodScore >= 40) return 'Neutral';
    if (moodScore >= 20) return 'Down';
    return 'Sad';
  };
  
  // Get emoji based on mood
  const getMoodEmoji = () => {
    if (moodScore >= 80) return '😊';
    if (moodScore >= 60) return '🙂';
    if (moodScore >= 40) return '😐';
    if (moodScore >= 20) return '🙁';
    return '😔';
  };
  
  // Get color theme based on mood score
  const getMoodThemeColor = () => {
    if (moodScore >= 60) return 'text-teal';
    if (moodScore >= 40) return 'text-blue';
    return 'text-red-700';
  };
  
  // Set background color based on mood score 
  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    if (moodScore >= 60) {
      // Happy/good mood - keep the teal theme
      if (isDarkMode) {
        root.style.setProperty('--neuro-bg', '160, 48%, 15%');
        root.style.setProperty('--neuro-shadow-dark', '160, 48%, 10%');
        root.style.setProperty('--neuro-shadow-light', '160, 48%, 20%');
      } else {
        root.style.setProperty('--neuro-bg', '160, 48%, 95%');
        root.style.setProperty('--neuro-shadow-dark', '160, 48%, 85%');
        root.style.setProperty('--neuro-shadow-light', '0, 0%, 100%');
      }
    } else if (moodScore >= 40) {
      // Neutral mood - blue theme
      if (isDarkMode) {
        root.style.setProperty('--neuro-bg', '210, 65%, 15%');
        root.style.setProperty('--neuro-shadow-dark', '210, 65%, 10%');
        root.style.setProperty('--neuro-shadow-light', '210, 65%, 20%');
      } else {
        root.style.setProperty('--neuro-bg', '210, 65%, 95%');
        root.style.setProperty('--neuro-shadow-dark', '210, 65%, 85%');
        root.style.setProperty('--neuro-shadow-light', '0, 0%, 100%');
      }
    } else {
      // Low mood - deeper red theme that's not glossy
      if (isDarkMode) {
        root.style.setProperty('--neuro-bg', '350, 40%, 12%');
        root.style.setProperty('--neuro-shadow-dark', '350, 40%, 8%');
        root.style.setProperty('--neuro-shadow-light', '350, 30%, 18%');
      } else {
        root.style.setProperty('--neuro-bg', '350, 35%, 92%');
        root.style.setProperty('--neuro-shadow-dark', '350, 35%, 82%');
        root.style.setProperty('--neuro-shadow-light', '0, 0%, 100%');
      }
    }
    
    // Restore default theme when component unmounts
    return () => {
      if (isDarkMode) {
        root.style.setProperty('--neuro-bg', '160, 48%, 15%');
        root.style.setProperty('--neuro-shadow-dark', '160, 48%, 10%');
        root.style.setProperty('--neuro-shadow-light', '160, 48%, 20%');
      } else {
        root.style.setProperty('--neuro-bg', '160, 48%, 95%');
        root.style.setProperty('--neuro-shadow-dark', '160, 48%, 85%');
        root.style.setProperty('--neuro-shadow-light', '0, 0%, 100%');
      }
    };
  }, [moodScore]);
  
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

  if (dashboardLoading || locationLoading) {
    return <div className="neuro-container flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="neuro-container pb-24">
      {/* Regular header with page title */}
      <header className="flex justify-between items-center mb-4">
        <div className="w-8"></div> {/* Spacer to balance the layout */}
        <h1 className={`text-2xl font-extrabold ${getMoodThemeColor()} text-center`}>MoodUp</h1>
        <UserAvatar />
      </header>
      
      {/* Error messages */}
      {(dashboardError || locationError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {dashboardError || locationError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div>
          {/* Enhanced Unified Mood Dashboard Card */}
          <div className="neuro-card overflow-hidden mb-4">
            {/* Top greeting section with integrated design */}
            <div className="px-6 pt-4 pb-0">
              <div className="flex items-start justify-between mb-2">
              {location && (
                <div className="mb-4 text-sm text-gray-600">
                  <span className="material-icons text-sm align-text-top mr-1">location_on</span>
                  Location: {location.name || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </div>
              )}
                
              </div>
              
              <div className="flex items-center mb-4">
                <UserAvatar size="lg" className="mr-4" />
                
                <div>
                  <h1 className={`text-3xl font-bold mb-1 ${getMoodThemeColor()}`}>
                    Hi, {firstName}!
                  </h1>
                  
                  <div className="flex items-center">
                    <span className="mr-1 text-2xl">{getMoodEmoji()}</span>
                    <span className="text-gray-700">{getMoodStatus()}</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Large enhanced mood circle */}
            <div className="px-4 py-6 flex justify-center">
              <MoodCircle 
                moodScore={moodScore} 
                factors={statistics?.highest_mood?.factors}
                size="large"
              />
            </div>
          </div>
          
          {/* AI Mood Analysis */}
          {statistics?.ai_mood_analysis && (
            <AIMoodAnalysis moodAnalysis={statistics.ai_mood_analysis} moodScore={moodScore} />
          )}
          
          {/* Mood Stats Card */}
          {statistics && (
            <div className="neuro-card p-4 mb-4">
              <h3 className={`text-md font-semibold ${getMoodThemeColor()} mb-4`}>Your Mood Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="neuro-inset p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Average Mood</div>
                  <div className="font-medium text-lg">{statistics.average_mood}/10</div>
                </div>
                <div className="neuro-inset p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Total Entries</div>
                  <div className="font-medium text-lg">{statistics.entries_count}</div>
                </div>
                <div className="neuro-inset p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Most Frequent</div>
                  <div className="font-medium text-lg">{statistics.most_frequent_mood}/10</div>
                </div>
                {statistics.highest_mood.location && (
                  <div className="neuro-inset p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Best Location</div>
                    <div className="font-medium text-lg">{statistics.highest_mood.location}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Mood Factors Card */}
          {statistics?.highest_mood?.factors && (
            <div className="neuro-card p-4 mb-4">
              <h3 className={`text-md font-semibold ${getMoodThemeColor()} mb-3`}>Mood Factors</h3>
              <ul className="neuro-inset p-4 rounded-lg text-sm list-disc pl-5">
                {statistics.highest_mood.factors.map((factor, index) => (
                  <li key={index} className="mb-2">{factor}</li>
                ))}
              </ul>
            </div>
          )}
          
          <MoodInput onMoodSelect={handleMoodSelect} />
          
          <div className="mt-4 text-center">
            <Link to="/history" className={`neuro-button inline-flex items-center ${getMoodThemeColor()}`}>
              <span className="material-icons mr-2 text-sm">history</span>
              View Mood History
            </Link>
          </div>
        </div>
        
        <div>
          {/* Use recommendations from AI analysis */}
          {statistics?.ai_mood_analysis?.recommendations && (
            <MoodRecommendation 
              recommendations={statistics.ai_mood_analysis.recommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 