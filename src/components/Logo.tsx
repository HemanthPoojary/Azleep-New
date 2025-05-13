
import React from 'react';
import { Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Tilted moon for sleeping appearance */}
        <div className="relative">
          <Moon 
            className="text-[#9b87f5] h-6 w-6 md:h-8 md:w-8 transform rotate-90" 
            strokeWidth={1.5}
          />
          {/* "Z" character to represent sleeping */}
          <div className="absolute top-0 right-0 text-white text-xs md:text-sm font-bold">Z</div>
          <div className="absolute top-2 right-2 text-white text-xs md:text-sm font-bold opacity-70">z</div>
          <div className="absolute top-4 right-4 text-white text-xs md:text-sm font-bold opacity-40">z</div>
        </div>
      </div>
      <span className="font-bold text-xl md:text-2xl text-white">Azleep</span>
    </Link>
  );
};

export default Logo;
