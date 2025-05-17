import React from 'react';
import { Recommendation } from '../types';

interface MoodRecommendationProps {
  recommendations: Recommendation[];
}

const MoodRecommendation: React.FC<MoodRecommendationProps> = ({ 
  recommendations
}) => {
  return (
    <div className="space-y-6">
      <div className="neuro-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-teal-500"></div>
        <div className="pl-4">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Recommendations</h3>
          <ul className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center group transition-all duration-300 hover:translate-x-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-medium shadow-md mr-3 group-hover:shadow-lg transition-all duration-300">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium">{recommendation.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MoodRecommendation; 