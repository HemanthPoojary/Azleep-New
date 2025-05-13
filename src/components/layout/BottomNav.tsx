
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Mic, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Sleep",
      icon: Moon,
      path: "/",
    },
    {
      label: "Voice",
      icon: Mic,
      path: "/voice",
    },
    {
      label: "Stats",
      icon: Calendar,
      path: "/stats",
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
              "flex flex-col items-center justify-center rounded-md px-4 py-2 text-sm transition-colors",
              currentPath === item.path
                ? "text-azleep-primary"
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
