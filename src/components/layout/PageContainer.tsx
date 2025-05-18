
import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

interface PageContainerProps {
  children: ReactNode;
  withBottomNav?: boolean;
  className?: string;
}

const PageContainer = ({ 
  children, 
  withBottomNav = true, 
  className = "" 
}: PageContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="app-container">
      <header className="p-4 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
        </div>
      </header>
      <main className={`flex-1 px-4 md:px-8 pb-20 pt-6 max-w-4xl mx-auto w-full ${className}`}>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      {withBottomNav && isMobile && <BottomNav />}
    </div>
  );
};

export default PageContainer;
