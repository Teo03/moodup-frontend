import { useState, useEffect, useCallback } from 'react';

export interface UserSettings {
  name: string;
  profilePicture: string | null;
}

export const useUserProfile = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    profilePicture: null
  });
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings: UserSettings = JSON.parse(savedSettings);
        setUserSettings(parsedSettings);
      } catch (err) {
        console.error('Error parsing user settings from localStorage', err);
      }
    }
  }, []);
  
  // Update and save settings to localStorage
  const updateUserSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setUserSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);
  
  // Get user initials for avatar fallback
  const getUserInitials = useCallback(() => {
    if (!userSettings.name) return 'U';
    
    const nameParts = userSettings.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    
    return 'U';
  }, [userSettings.name]);
  
  return {
    userSettings,
    updateUserSettings,
    getUserInitials
  };
};

export default useUserProfile; 