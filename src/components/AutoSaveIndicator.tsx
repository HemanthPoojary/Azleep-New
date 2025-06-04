import React from 'react';
import { CheckCircle, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  status: 'saving' | 'saved' | 'error' | 'idle';
  lastSaved?: Date | null;
  isConnected?: boolean;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSaved,
  isConnected = true,
  className
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return isConnected ? 
          <Wifi className="h-4 w-4 text-blue-400" /> : 
          <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved ? 
          `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 
          'Saved';
      case 'error':
        return 'Save failed';
      default:
        return isConnected ? 'Real-time sync active' : 'Offline mode';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-400';
      case 'saved':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return isConnected ? 'text-blue-400' : 'text-gray-400';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs transition-all duration-300",
      getStatusColor(),
      className
    )}>
      {getStatusIcon()}
      <span className="hidden sm:inline">{getStatusText()}</span>
    </div>
  );
}; 