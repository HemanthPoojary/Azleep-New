
import React from 'react';
import { Card } from '@/components/ui/card';
import { Moon } from 'lucide-react';

interface NightStatsProps {
  lastSessionDate?: string;
  completedSessions?: number;
  totalMinutes?: number;
}

const NightStats = ({ 
  lastSessionDate = "Today", 
  completedSessions = 0, 
  totalMinutes = 0 
}: NightStatsProps) => {
  return (
    <div className="sleep-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-azleep-text">Sleep Stats</h3>
        <Moon className="h-5 w-5 text-azleep-secondary" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Last Session</p>
          <p className="text-lg font-semibold">{lastSessionDate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sessions</p>
          <p className="text-lg font-semibold">{completedSessions}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Total Sleep Minutes</p>
          <p className="text-lg font-semibold">{totalMinutes} mins</p>
        </div>
      </div>
    </div>
  );
};

export default NightStats;
