import React from 'react';
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  status: SaveStatus;
  className?: string;
  message?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  status, 
  className,
  message 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: message || 'Saving...',
          className: 'text-blue-500',
          iconClassName: 'animate-spin'
        };
      case 'saved':
        return {
          icon: Check,
          text: message || 'Saved',
          className: 'text-green-500',
          iconClassName: ''
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: message || 'Save failed',
          className: 'text-red-500',
          iconClassName: ''
        };
      case 'idle':
      default:
        return {
          icon: Cloud,
          text: message || 'Auto-save enabled',
          className: 'text-gray-400',
          iconClassName: ''
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-center gap-2 text-sm transition-all duration-200',
      config.className,
      className
    )}>
      <Icon size={14} className={config.iconClassName} />
      <span>{config.text}</span>
    </div>
  );
};

export default AutoSaveIndicator; 