import React, { useEffect, useState } from 'react';

interface MoodFactor {
  name: string;
  impact: number;
  color: string;
}

interface MoodCircleProps {
  moodScore: number;
  factors?: string[];
}

const MoodCircle: React.FC<MoodCircleProps> = ({ 
  moodScore, 
  factors = []
}) => {
  // Calculate the circumference of the circles
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // State for animations
  const [animatedScore, setAnimatedScore] = useState(0);
  const [factorsData, setFactorsData] = useState<MoodFactor[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Parse factors to extract impact values and create factor objects
  const parseMoodFactors = (factors: string[]): MoodFactor[] => {
    const moodFactors: MoodFactor[] = [];
    
    // Default factors if none provided or couldn't parse any
    if (!factors || factors.length === 0) {
      return [
        { name: 'Temperature', impact: 25, color: 'hsl(267, 75%, 80%)' },
        { name: 'Cloud Cover', impact: 15, color: 'hsl(151, 65%, 75%)' },
        { name: 'Visibility', impact: 10, color: 'hsl(25, 65%, 75%)' }
      ];
    }
    
    // Parse each factor to extract impact points
    factors.forEach((factor, index) => {
      // Extract point values using regex - looking for patterns like "added 10 points" or "15 points"
      const pointsMatch = factor.match(/([-]?\d+\.?\d*)(?:\s+points)/i);
      if (pointsMatch) {
        const impact = Math.abs(parseFloat(pointsMatch[1]));
        
        // Extract factor name - first part before any impact mention
        let name = factor.split(' had a ')[0];
        if (name.includes(':')) {
          name = name.split(':')[0];
        } else if (name.includes(' of ')) {
          name = name.split(' of ')[0];
        }
        
        // Map to different colors based on index
        const colors = [
          'hsl(267, 75%, 80%)',  // Purple
          'hsl(151, 65%, 75%)',  // Green
          'hsl(25, 65%, 75%)',   // Orange
          'hsl(200, 65%, 75%)',  // Blue
          'hsl(340, 65%, 75%)'   // Pink
        ];
        
        moodFactors.push({
          name,
          impact,
          color: colors[index % colors.length]
        });
      }
    });
    
    // If we couldn't parse any factors, return defaults
    if (moodFactors.length === 0) {
      return [
        { name: 'Weather', impact: 25, color: 'hsl(267, 75%, 80%)' },
        { name: 'Environment', impact: 15, color: 'hsl(151, 65%, 75%)' },
        { name: 'Other', impact: 10, color: 'hsl(25, 65%, 75%)' }
      ];
    }
    
    return moodFactors;
  };
  
  // Parse the factors once when component mounts or factors change
  useEffect(() => {
    setFactorsData(parseMoodFactors(factors));
    setAnimationComplete(false);
  }, [factors]);
  
  // Animation effect
  useEffect(() => {
    // Reset animation state when data changes
    setAnimatedScore(0);
    
    // Animate mood score
    const scoreDuration = 1500;
    const scoreFrames = 60;
    const scoreIncrement = moodScore / scoreFrames;
    let scoreCount = 0;
    
    const scoreAnimation = setInterval(() => {
      scoreCount++;
      setAnimatedScore(Math.min(Math.round(scoreIncrement * scoreCount), moodScore));
      
      if (scoreCount >= scoreFrames) {
        clearInterval(scoreAnimation);
        setAnimationComplete(true);
      }
    }, scoreDuration / scoreFrames);
    
    return () => {
      clearInterval(scoreAnimation);
    };
  }, [moodScore, factorsData]);
  
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
        {/* Render all factor rings simultaneously with staggered animation delays */}
        {factorsData.map((factor, index) => {
          // Calculate offset based on impact percentage 
          const offset = circumference - (factor.impact / 100) * circumference;
          const gap = index * 10; // Gap between rings
          
          return (
            <svg key={index} className="w-full h-full absolute">
              <circle 
                cx="96" 
                cy="96" 
                r={radius - gap} 
                fill="none" 
                stroke={factor.color} 
                strokeWidth="6"
                strokeDasharray={circumference - (gap * Math.PI)}
                strokeDashoffset={circumference}
                className="mood-progress-ring"
                transform="rotate(-90 96 96)"
                style={{
                  animation: 'none', // Disable the CSS animation
                  transition: `stroke-dashoffset 1s ease-out ${index * 0.3}s`,
                  strokeDashoffset: animationComplete ? offset : circumference
                }}
              />
            </svg>
          );
        })}
        
        {/* Mood Score */}
        <div className="z-10 text-center">
          <div className={`text-5xl font-bold ${getMoodColor(moodScore)}`}>
            {animatedScore}
          </div>
          <div className="text-sm text-gray-500 mt-1">Mood Score</div>
        </div>
      </div>
      
      {/* Factor Legend */}
      <div className="grid grid-cols-1 gap-2 w-full max-w-xs mt-2">
        {factorsData.map((factor, index) => (
          <div 
            key={index} 
            className="flex items-center text-sm" 
            style={{
              opacity: animationComplete ? 1 : 0,
              transform: animationComplete ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.5s ease-out ${0.8 + (index * 0.2)}s`
            }}
          >
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: factor.color}}></div>
            <div className="flex-1">{factor.name}</div>
            <div className="font-semibold">{factor.impact}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodCircle; 