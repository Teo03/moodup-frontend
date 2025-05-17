import React, { useEffect, useState } from 'react';

interface MoodFactor {
  name: string;
  impact: number;
  points: number; // Actual points contributed to the score
  color: string;
}

interface MoodCircleProps {
  moodScore: number;
  factors?: string[];
  size?: 'default' | 'large';
}

const MoodCircle: React.FC<MoodCircleProps> = ({ 
  moodScore, 
  factors = [],
  size = 'default'
}) => {
  // Updated dimensions and radii for more spacing
  const isLarge = size === 'large';
  const baseRadius = isLarge ? 130 : 100; // Radius for the centerline of the outermost ring
  
  // State for animations
  const [animatedScore, setAnimatedScore] = useState(0);
  const [factorsData, setFactorsData] = useState<MoodFactor[]>([]);
  const [, setAnimationComplete] = useState(false);
  
  // Parse factors to extract impact values and create factor objects
  const parseMoodFactors = (factors: string[]): MoodFactor[] => {
    const moodFactors: MoodFactor[] = [];
    
    // Default factors if none provided or couldn't parse any
    if (!factors || factors.length === 0) {
      return [
        { name: 'Temperature', impact: 25, points: 20, color: 'hsl(160, 48%, 60%)' }, 
        { name: 'Cloud Cover', impact: 15, points: 15, color: 'hsl(43, 100%, 60%)' }, 
        { name: 'Visibility', impact: 10, points: 10, color: 'hsl(36, 28%, 63%)' }    
      ];
    }
    
    factors.forEach((factor, index) => {
      const pointsMatch = factor.match(/([-]?\d+\.?\d*)(?:\s+points)/i);
      if (pointsMatch) {
        const points = Math.abs(parseFloat(pointsMatch[1]));
        const impact = moodScore > 0 ? Math.round((points / moodScore) * 100) : 0;
        let name = factor.split(' had a ')[0];
        if (name.includes(':')) name = name.split(':')[0];
        else if (name.includes(' of ')) name = name.split(' of ')[0];
        
        const colors = [
          'hsl(160, 48%, 60%)', 'hsl(43, 100%, 60%)', 'hsl(36, 28%, 63%)',  
          'hsl(160, 48%, 80%)', 'hsl(43, 100%, 80%)'
        ];
        moodFactors.push({ name, impact, points, color: colors[index % colors.length] });
      }
    });
    
    if (moodFactors.length === 0) {
      const basePoints = moodScore > 0 ? moodScore / 5 : 20; 
      return [
        { name: 'Weather', impact: 35, points: Math.round(basePoints * 1.4), color: 'hsl(160, 48%, 60%)' },
        { name: 'Environment', impact: 25, points: Math.round(basePoints), color: 'hsl(43, 100%, 60%)' },
        { name: 'Other', impact: 15, points: Math.round(basePoints * 0.6), color: 'hsl(36, 28%, 63%)' }
      ];
    }
    return moodFactors;
  };
  
  useEffect(() => {
    setFactorsData(parseMoodFactors(factors));
    setAnimationComplete(false);
    setTimeout(() => setAnimationComplete(true), 100);
  }, [factors, moodScore]);
  
  useEffect(() => {
    setAnimatedScore(0);
    const scoreDuration = 1500, scoreFrames = 60;
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
    return () => clearInterval(scoreAnimation);
  }, [moodScore, factorsData]);
  
  const getMoodColor = (score: number) => {
    if (score >= 90) return { color: '#3BA181' }; if (score >= 80) return { color: '#4fb996' };
    if (score >= 70) return { color: '#63c1a0' }; if (score >= 60) return { color: '#77caab' };
    if (score >= 50) return { color: '#8bd3b6' }; if (score >= 40) return { color: '#ff6666' };
    if (score >= 30) return { color: '#ff3333' }; if (score >= 20) return { color: '#ff0000' };
    if (score >= 10) return { color: '#cc0000' }; return { color: '#990000' };
  };

  const dimensions = isLarge ? 'w-64 h-64' : 'w-56 h-56';
  const centerPoint = isLarge ? 128 : 112;
  const scoreSize = isLarge ? 'text-7xl' : 'text-6xl';

  const totalPoints = factorsData.reduce((sum, factor) => sum + factor.points, 0) || 1; // Avoid division by zero
  const strokeWidth = 14;
  const ringCenterlineSpacing = 20; // Space between centerlines of adjacent rings

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`mood-circle ${dimensions} mb-4 relative`}>
        {factorsData.map((factor, index) => {
          const currentRingRadius = baseRadius - (index * ringCenterlineSpacing);
          if (currentRingRadius <= strokeWidth / 2) return null; // Don't draw if radius is too small or zero

          const proportion = factor.points / totalPoints;
          const gapSize = 0.02; // 2% gap between segments, relative to full circle
          
          const currentCircumference = 2 * Math.PI * currentRingRadius;
          // Calculate segment length, ensuring it's not negative after gap subtraction
          const segmentProportion = Math.max(0, proportion - gapSize);
          const strokePortion = segmentProportion * currentCircumference;
          const strokeGap = currentCircumference - strokePortion;
          
          return (
            <svg key={index} className="w-full h-full absolute top-0 left-0">
              <circle 
                cx={centerPoint} 
                cy={centerPoint} 
                r={currentRingRadius} 
                fill="none" 
                stroke={factor.color} 
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${strokePortion} ${strokeGap}`}
                strokeDashoffset={0} // Start drawing from the beginning of the path
                opacity={factor.points > 0 ? "1" : "0.3"}
                transform={`rotate(-90 ${centerPoint} ${centerPoint})`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }} // Animate the dash array for effect
              />
            </svg>
          );
        })}
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className={`${scoreSize} font-bold`} style={getMoodColor(moodScore)}>
            {animatedScore}
          </div>
          <div className="text-sm text-gray-500 mt-1">Mood Score</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 w-full max-w-xs mt-2">
        {factorsData.map((factor, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: factor.color}}></div>
            <div className="flex-1">{factor.name}</div>
            <div className="font-semibold">{factor.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodCircle; 