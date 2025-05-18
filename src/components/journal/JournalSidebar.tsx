
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar } from 'lucide-react';

// Mock data
const streakData = {
  current: 5,
  longest: 14,
  total: 28,
  thisMonth: 12,
};

const moodDistribution = [
  { mood: 'Peaceful', count: 8, color: 'bg-blue-500' },
  { mood: 'Grateful', count: 6, color: 'bg-green-500' },
  { mood: 'Reflective', count: 5, color: 'bg-purple-500' },
  { mood: 'Anxious', count: 3, color: 'bg-amber-500' },
  { mood: 'Tired', count: 2, color: 'bg-red-500' },
];

const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const JournalSidebar = () => {
  // Generate last 7 days for streak calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => ({
    day: getDateString(6 - i),
    hasEntry: Math.random() > 0.3, // Randomly determine if there's an entry
  }));
  
  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-azleep-accent/80 to-azleep-primary/70 border-none text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Journal Streak</h4>
              <p className="text-sm text-white/80">Keep reflecting daily!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{streakData.current}</p>
              <p className="text-xs">Current Streak</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{streakData.longest}</p>
              <p className="text-xs">Longest Streak</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm">Last 7 days:</p>
          </div>
          
          <div className="flex justify-between">
            {last7Days.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                    ${day.hasEntry ? 'bg-white text-azleep-primary' : 'bg-white/20'}`}
                >
                  {day.hasEntry ? '✓' : ''}
                </div>
                <span className="text-xs">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Summary */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-4">
          <h4 className="text-lg font-semibold mb-3">Your Journal Stats</h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{streakData.total}</p>
              <p className="text-xs text-white/80">Total Entries</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{streakData.thisMonth}</p>
              <p className="text-xs text-white/80">This Month</p>
            </div>
          </div>
          
          <Separator className="bg-white/20 my-4" />
          
          <div className="mb-3">
            <h5 className="text-sm font-medium mb-3">Mood Distribution</h5>
            <div className="space-y-2">
              {moodDistribution.map((item) => (
                <div key={item.mood} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                    <span className="text-sm">{item.mood}</span>
                  </div>
                  <span className="text-sm">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
