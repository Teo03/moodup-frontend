import React from 'react';
import { Link } from 'react-router-dom';
import MoodCircle from '../components/MoodCircle';
import MoodRecommendation from '../components/MoodRecommendation';
import MoodInput from '../components/MoodInput';

const Dashboard: React.FC = () => {
  // Mock data
  const moodScore = 75;
  const trafficLevel = 60;
  const weatherUv = 45;
  const otherIndicator = 80;
  
  const explanation = 
    "Your mood score today is 75 based on several factors. The moderate traffic (60%) on your commute route might cause some delays, and moderate UV levels (45%) suggest fair weather. Other indicators like sleep quality (80%) are positive. Overall, you're likely to have a good day.";
  
  const recommendations = [
    "Take a 10-minute walk during your lunch break to boost your mood further.",
    "Listen to uplifting music during your commute to counteract traffic stress.",
    "Stay hydrated and apply sunscreen due to moderate UV levels today.",
    "Schedule an important meeting for the morning when your energy levels are likely to be highest."
  ];
  
  const handleMoodSelect = (mood: number) => {
    console.log('Selected mood:', mood);
    // In a real app, this would send the mood to an API
  };

  return (
    <div className="neuro-container pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-600">MoodUp</h1>
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-semibold">TB</span>
        </div>
      </header>
      
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
            explanation={explanation} 
            recommendations={recommendations} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 