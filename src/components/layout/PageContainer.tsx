
import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Music, BookOpen, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

  const navLinks = [
    {
      path: '/app/dashboard',
      label: 'Dashboard',
      icon: Home
    },
    {
      path: '/app/check-in',
      label: 'Daily Check-in',
      icon: MessageCircle
    },
    {
      path: '/app/sleep-cast',
      label: 'Sleep Cast',
      icon: Music
    },
    {
      path: '/app/journal',
      label: 'Journal',
      icon: BookOpen
    }
  ];

  return (
    <div className="app-container">
      <header className="p-3 md:p-4 border-b border-white/10">
        <div className="flex justify-between items-center px-1 md:px-2">
          <Logo />
          
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[75vw] bg-azleep-dark/95 border-l border-white/10 p-0">
                <div className="flex flex-col h-full py-4">
                  <div className="px-4 mb-4">
                    <Logo />
                  </div>
                  <nav className="flex-1">
                    <ul className="space-y-2 px-2">
                      {navLinks.map((link) => (
                        <li key={link.path}>
                          <Link to={link.path}>
                            <Button 
                              variant={currentPath === link.path ? 'default' : 'ghost'} 
                              className="w-full justify-start text-lg"
                            >
                              <link.icon className="mr-2 h-5 w-5" />
                              {link.label}
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button 
                    variant={currentPath === link.path ? 'default' : 'ghost'} 
                    className="flex items-center gap-2"
                  >
                    <link.icon className="h-4 w-4" /> {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className={`flex-1 px-2 pb-20 pt-4 w-full overflow-x-hidden ${className}`}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      {withBottomNav && isMobile && <BottomNav />}
    </div>
  );
};

export default PageContainer;
