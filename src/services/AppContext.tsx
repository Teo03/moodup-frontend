import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MoodStatistics } from '../types';

// Update the interface to make actualMood optional
export interface ProcessedMoodEntry {
  date: string;
  predictedMood: number;
  actualMood?: number;  // Optional property
}

interface AppContextType {
  // Dashboard data
  statistics: MoodStatistics | null;
  setStatistics: React.Dispatch<React.SetStateAction<MoodStatistics | null>>;
  
  // History data
  moodHistory: ProcessedMoodEntry[];
  setMoodHistory: React.Dispatch<React.SetStateAction<ProcessedMoodEntry[]>>;
  
  // Loading states
  dashboardLoading: boolean;
  setDashboardLoading: React.Dispatch<React.SetStateAction<boolean>>;
  historyLoading: boolean;
  setHistoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Error states
  dashboardError: string | null;
  setDashboardError: React.Dispatch<React.SetStateAction<string | null>>;
  historyError: string | null;
  setHistoryError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Dashboard state
  const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  // History state
  const [moodHistory, setMoodHistory] = useState<ProcessedMoodEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Create the context value object
  const contextValue = {
    statistics,
    setStatistics,
    moodHistory,
    setMoodHistory,
    dashboardLoading,
    setDashboardLoading,
    historyLoading,
    setHistoryLoading,
    dashboardError,
    setDashboardError,
    historyError,
    setHistoryError
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 