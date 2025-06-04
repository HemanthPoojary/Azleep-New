import React from 'react';
import Logo from '@/components/Logo';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-20 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
