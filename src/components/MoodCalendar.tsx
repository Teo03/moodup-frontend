import React from 'react';

interface MoodHistoryEntry {
  date: string;
  predictedMood: number;
  actualMood?: number;
}

interface MoodCalendarProps {
  moodHistory: MoodHistoryEntry[];
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ moodHistory }) => {
  // Get the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get day of week of first day of month (0 = Sunday)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create calendar days array
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Add empty slots for days before the first day of month
  const emptyDays = Array(firstDayOfMonth).fill(null);
  const allDays = [...emptyDays, ...calendarDays];
  
  // Week days
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get mood color
  const getMoodColor = (mood?: number) => {
    if (!mood) return 'bg-gray-200';
    if (mood >= 80) return 'bg-green-500';
    if (mood >= 60) return 'bg-blue-500';
    if (mood >= 40) return 'bg-yellow-500';
    if (mood >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Find mood data for a specific day
  const getMoodData = (day: number | null) => {
    if (day === null) return null;
    
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodHistory.find(entry => entry.date === dateStr);
  };

  return (
    <div className="neuro-card mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-500">{monthName} {currentYear}</h3>
        <div className="flex space-x-4">
          <button className="neuro-button text-sm">◀ Prev</button>
          <button className="neuro-button text-sm">Next ▶</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Week days header */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map((day, index) => {
          const moodData = getMoodData(day);
          
          return (
            <div 
              key={index} 
              className={`aspect-square flex flex-col items-center justify-center p-1 ${day ? 'neuro-inset' : ''}`}
            >
              {day && (
                <>
                  <div className="text-xs font-medium mb-1">{day}</div>
                  {moodData && (
                    <div className="flex w-full space-x-1 mt-1 justify-center">
                      <div 
                        className={`h-2 w-2 rounded-full ${getMoodColor(moodData.predictedMood)}`} 
                        title={`Predicted: 79`}
                      />
                      {moodData.actualMood && (
                        <div 
                          className={`h-2 w-2 rounded-full ${getMoodColor(moodData.actualMood)}`}
                          title={`Actual: ${moodData.actualMood}`}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-4 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
          <span>Predicted</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-400 mr-1"></div>
          <span>Actual</span>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar; 