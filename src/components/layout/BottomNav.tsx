
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Mic, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Dashboard",
      icon: Moon,
      path: "/app/dashboard",
    },
    {
      label: "Voice",
      icon: Mic,
      path: "/app/voice",
    },
    {
      label: "Sleep Cast",
      icon: Music,
      path: "/app/sleep-cast",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-700/20 bg-azleep-dark/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center rounded-md px-4 py-2 text-sm transition-all",
              currentPath === item.path
                ? "text-azleep-accent scale-110"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
