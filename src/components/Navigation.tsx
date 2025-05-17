import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
      <div className="neuro-card flex space-x-4 px-8">
        <Link 
          to="/" 
          className={`neuro-button flex items-center justify-center px-6 ${
            location.pathname === '/' ? 'text-teal font-semibold' : 'text-gray-600'
          }`}
        >
          <span className="material-icons mr-2">dashboard</span>
          Dashboard
        </Link>
        
        <Link 
          to="/history" 
          className={`neuro-button flex items-center justify-center px-6 ${
            location.pathname === '/history' ? 'text-teal font-semibold' : 'text-gray-600'
          }`}
        >
          <span className="material-icons mr-2">history</span>
          History
        </Link>
        
        <Link 
          to="/settings" 
          className={`neuro-button flex items-center justify-center px-6 ${
            location.pathname === '/settings' ? 'text-teal font-semibold' : 'text-gray-600'
          }`}
        >
          <span className="material-icons mr-2">settings</span>
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Navigation; 