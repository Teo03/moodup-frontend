import React from 'react';
import useUserProfile from '../hooks/useUserProfile';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const { userSettings, getUserInitials } = useUserProfile();
  
  // Set size based on prop
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl'
  };
  
  const avatarSize = sizeClasses[size];
  
  return (
    <div className={`rounded-full flex items-center justify-center overflow-hidden ${avatarSize} ${className}`}>
      {userSettings.profilePicture ? (
        <img 
          src={userSettings.profilePicture} 
          alt={userSettings.name || 'User'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="bg-teal-light text-teal w-full h-full flex items-center justify-center font-semibold">
          {getUserInitials()}
        </div>
      )}
    </div>
  );
};

export default UserAvatar; 