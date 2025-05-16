import React from 'react';

interface MoodCircleProps {
  moodScore: number;
  trafficLevel?: number;
  weatherUv?: number;
  otherIndicator?: number;
}

const MoodCircle: React.FC<MoodCircleProps> = ({ 
  moodScore, 
  trafficLevel = 50, 
  weatherUv = 40,
  otherIndicator = 70
}) => {
  // Calculate the circumference of the circles
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset for each indicator
  const trafficOffset = circumference - (trafficLevel / 100) * circumference;
  const weatherOffset = circumference - (weatherUv / 100) * circumference;
  const otherOffset = circumference - (otherIndicator / 100) * circumference;
  
  // Get color based on mood score
  const getMoodColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mood-circle w-48 h-48 mb-4">
        {/* Traffic Indicator Ring */}
        <svg className="w-full h-full absolute">
          <circle 
            cx="96" 
            cy="96" 
            r={radius} 
            fill="none" 
            stroke="hsl(267, 75%, 80%)" 
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={trafficOffset}
            className="mood-progress-ring"
            transform="rotate(-90 96 96)"
          />
        </svg>
        
        {/* Weather UV Indicator Ring */}
        <svg className="w-full h-full absolute">
          <circle 
            cx="96" 
            cy="96" 
            r={radius - 10} 
            fill="none" 
            stroke="hsl(151, 65%, 75%)" 
            strokeWidth="6"
            strokeDasharray={circumference - 62.8}
            strokeDashoffset={weatherOffset}
            className="mood-progress-ring"
            transform="rotate(-90 96 96)"
          />
        </svg>
        
        {/* Other Indicator Ring */}
        <svg className="w-full h-full absolute">
          <circle 
            cx="96" 
            cy="96" 
            r={radius - 20} 
            fill="none" 
            stroke="hsl(25, 65%, 75%)" 
            strokeWidth="6"
            strokeDasharray={circumference - 125.6}
            strokeDashoffset={otherOffset}
            className="mood-progress-ring"
            transform="rotate(-90 96 96)"
          />
        </svg>
        
        {/* Mood Score */}
        <div className="z-10 text-center">
          <div className={`text-5xl font-bold ${getMoodColor(moodScore)}`}>
            {moodScore}
          </div>
          <div className="text-sm text-gray-500 mt-1">Mood Score</div>
        </div>
      </div>
    </div>
  );
};

export default MoodCircle; 