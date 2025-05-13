
import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';

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
  return (
    <div className="app-container">
      <main className={`flex-1 px-4 pb-20 pt-6 ${className}`}>
        {children}
      </main>
      {withBottomNav && <BottomNav />}
    </div>
  );
};

export default PageContainer;
