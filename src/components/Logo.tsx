import React from 'react';
import { Moon, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const location = useLocation();
  
  // Determine the redirect URL based on current path
  // If we're in the app section, redirect to dashboard
  // Otherwise redirect to landing page
  const redirectUrl = location.pathname.startsWith('/app') ? '/app/dashboard' : '/';
  
  return (
    <Link to={redirectUrl} className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Gold moon */}
        <div className="relative">
          <Moon 
            className="text-yellow-400 h-6 w-6 md:h-8 md:w-8" 
            strokeWidth={1.5}
            fill="#f9d342"
          />
          {/* Small star */}
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1">
            <Star className="h-3 w-3 md:h-4 md:w-4 text-white" strokeWidth={1.5} />
          </div>
          {/* Z letters floating above */}
          <div className="absolute -top-4 -right-2 flex flex-col items-end">
            <div className="flex">
              <span className="text-xs md:text-sm font-bold text-purple-400">z</span>
              <span className="text-xs md:text-sm font-bold text-purple-400 ml-1">z</span>
            </div>
            <div className="flex mt-px">
              <span className="text-xs md:text-sm font-bold text-purple-400">z</span>
              <span className="text-xs md:text-sm font-bold text-purple-400 ml-1">z</span>
            </div>
          </div>
        </div>
      </div>
      <span className="font-bold text-xl md:text-2xl text-purple-400">azleep</span>
    </Link>
  );
};

export default Logo;
