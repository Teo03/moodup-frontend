import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useUserProfile from '../hooks/useUserProfile';

const Settings: React.FC = () => {
  const { userSettings, updateUserSettings, getUserInitials } = useUserProfile();
  const [name, setName] = useState(userSettings.name);
  const [profilePicture, setProfilePicture] = useState<string | null>(userSettings.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Save settings to localStorage
  const saveSettings = () => {
    updateUserSettings({
      name,
      profilePicture
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Handle file selection for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for storage in localStorage
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfilePicture(reader.result as string);
    };
  };

  // Trigger file input click
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove profile picture
  const handleRemoveImage = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="neuro-container pb-24">
      {/* Regular header with page title */}
      <header className="flex justify-between items-center mb-4">
        <div className="w-10"></div> {/* Spacer to balance the layout */}
        <h1 className="text-2xl font-extrabold text-teal text-center">Settings</h1>
        <Link to="/">
          <div className="neuro-button py-2 px-4">
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Back
          </div>
        </Link>
      </header>

      <div className="neuro-card">
        <h2 className="text-xl font-semibold text-teal mb-4">Profile Settings</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="neuro-inset w-full p-3 text-md"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          
          <div className="flex items-center mb-4">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center ${
                profilePicture ? '' : 'neuro-inset'
              }`}>
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl font-semibold">
                    {getUserInitials()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-6 flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={handleSelectImage}
                className="neuro-button py-2 px-4 text-sm"
              >
                {profilePicture ? 'Change Picture' : 'Upload Picture'}
              </button>
              
              {profilePicture && (
                <button 
                  onClick={handleRemoveImage}
                  className="neuro-button py-2 px-4 text-sm text-red-500"
                >
                  Remove Picture
                </button>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={saveSettings}
            className="neuro-button bg-teal text-white py-3 px-6"
          >
            Save Settings
          </button>
          
          {isSaved && (
            <div className="text-green-500 animate-fade-in">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 