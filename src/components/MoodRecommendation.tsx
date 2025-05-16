import React from 'react';

interface MoodRecommendationProps {
  explanation: string;
  recommendations: string[];
}

const MoodRecommendation: React.FC<MoodRecommendationProps> = ({ 
  explanation, 
  recommendations 
}) => {
  return (
    <div className="space-y-4">
      <div className="neuro-card">
        <h3 className="text-lg font-semibold mb-2 text-purple-500">How You're Feeling Today</h3>
        <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
      </div>
      
      <div className="neuro-card">
        <h3 className="text-lg font-semibold mb-3 text-green-500">Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 h-5 w-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoodRecommendation; 