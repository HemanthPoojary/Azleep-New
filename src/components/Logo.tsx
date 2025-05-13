
import React from 'react';
import { Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Moon className="text-[#8E44AD] h-6 w-6 md:h-8 md:w-8" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <span className="font-bold text-xl md:text-2xl text-white">Azleep</span>
    </Link>
  );
};

export default Logo;
