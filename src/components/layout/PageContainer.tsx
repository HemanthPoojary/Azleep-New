
import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart, Mic, Music } from 'lucide-react';

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
        <div className="container mx-auto flex justify-between items-center">
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
              <Link to="/app/voice">
                <Button 
                  variant={currentPath === '/app/voice' ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <Mic className="h-4 w-4" /> Voice AI
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
          
          {/* Back to home/welcome button */}
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
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
