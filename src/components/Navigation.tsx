import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 neuro-button p-2 flex items-center justify-center"
        aria-label="Toggle navigation"
      >
        <span className="material-icons">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>
      
      {/* Sidebar Navigation */}
      <div 
        className={`fixed top-0 left-0 h-full py-4 px-2 flex flex-col bg-[hsl(var(--neuro-bg)/0.9)] z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="neuro-card flex flex-col space-y-4 px-4 pt-16 pb-4">
          <Link 
            to="/" 
            className={`neuro-button flex items-center px-4 py-3 ${
              location.pathname === '/' ? 'text-teal font-semibold' : 'text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <span className="material-icons mr-2">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/history" 
            className={`neuro-button flex items-center px-4 py-3 ${
              location.pathname === '/history' ? 'text-teal font-semibold' : 'text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <span className="material-icons mr-2">history</span>
            <span>History</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`neuro-button flex items-center px-4 py-3 ${
              location.pathname === '/settings' ? 'text-teal font-semibold' : 'text-gray-600'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <span className="material-icons mr-2">settings</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation; 