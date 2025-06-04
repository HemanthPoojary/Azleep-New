import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, BookOpen, Trophy, Flame } from 'lucide-react';
import { useJournalStats } from '@/hooks/useJournalStats';

export const JournalSidebar = () => {
  const { stats, isLoading } = useJournalStats();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-8 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-azleep-accent/80 to-azleep-primary/70 border-none text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-full">
              <Flame className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Journal Streak</h4>
              <p className="text-sm text-white/80">Keep reflecting daily!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs">Current Streak</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{stats.longestStreak}</p>
              <p className="text-xs">Longest Streak</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm">Last 7 days:</p>
          </div>
          
          <div className="flex justify-between">
            {stats.last7Days.map((day, i) => (
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
              <div className="flex items-center justify-center mb-1">
                <BookOpen className="h-4 w-4 text-blue-400 mr-1" />
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-white/80">Total Entries</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-green-400 mr-1" />
              </div>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
              <p className="text-xs text-white/80">This Month</p>
            </div>
          </div>

          {/* Points and Level */}
          <div className="bg-white/10 rounded-lg p-3 mb-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <Trophy className="h-4 w-4 text-purple-400 ml-1" />
            </div>
            <p className="text-lg font-bold">{stats.total * 10} points</p>
            <p className="text-xs text-white/80">Level {Math.floor((stats.total * 10) / 100)}</p>
          </div>
          
          <Separator className="bg-white/20 my-4" />
          
          <div className="mb-3">
            <h5 className="text-sm font-medium mb-3">Mood Distribution</h5>
            <div className="space-y-2">
              {stats.moodDistribution.length > 0 ? (
                stats.moodDistribution.map((item) => (
                  <div key={item.mood} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                      <span className="text-sm">{item.mood}</span>
                    </div>
                    <span className="text-sm">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60 text-center py-2">Start journaling to see your mood patterns</p>
              )}
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            <Calendar className="mr-2 h-4 w-4" />
            View Full History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
