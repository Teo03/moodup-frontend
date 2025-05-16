import React, { useState } from 'react';

interface MoodInputProps {
  onMoodSelect: (mood: number) => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  
  const moods = [
    { value: 20, emoji: '😢', label: 'Sad' },
    { value: 40, emoji: '😕', label: 'Meh' },
    { value: 60, emoji: '😐', label: 'Neutral' },
    { value: 80, emoji: '🙂', label: 'Good' },
    { value: 100, emoji: '😁', label: 'Great' }
  ];
  
  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="neuro-card mt-6">
      <h3 className="text-lg font-semibold mb-4 text-purple-500">How are you feeling right now?</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`neuro-button flex flex-col items-center py-4 ${
              selectedMood === mood.value ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodInput; 