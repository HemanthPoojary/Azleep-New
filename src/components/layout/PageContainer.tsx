
import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart, MessageCircle, Music, BookOpen } from 'lucide-react';

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
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="app-container">
      <header className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center px-2">
          <Logo />
          
          {/* Top Navigation Links for desktop/tablet */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/app/dashboard">
                <Button 
                  variant={currentPath === '/app/dashboard' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Link to="/app/check-in">
                <Button 
                  variant={currentPath === '/app/check-in' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> Daily Check-in
                </Button>
              </Link>
              <Link to="/app/sleep-cast">
                <Button 
                  variant={currentPath === '/app/sleep-cast' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <Music className="h-4 w-4" /> Sleep Cast
                </Button>
              </Link>
              <Link to="/app/journal">
                <Button 
                  variant={currentPath === '/app/journal' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" /> Journal
                </Button>
              </Link>
              <Link to="/app/stats">
                <Button 
                  variant={currentPath === '/app/stats' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <BarChart className="h-4 w-4" /> Stats
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className={`flex-1 px-1 sm:px-2 pb-20 pt-4 w-full ${className}`}>
        {children}
      </main>
      {withBottomNav && isMobile && <BottomNav />}
    </div>
  );
};

export default PageContainer;
