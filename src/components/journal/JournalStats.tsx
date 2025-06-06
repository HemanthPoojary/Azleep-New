import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Trophy, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays } from 'date-fns';

export const JournalStats = () => {
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJournalStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Calculate total entries
          setTotalEntries(data.length);
          
          // Calculate points (10 points per entry)
          setPoints(data.length * 10);

          // Calculate streak
          let currentStreak = 0;
          const today = new Date();
          today.setHours(23, 59, 59, 999); // End of today
          
          let checkDate = today;
          let hasEntryToday = false;

          // Check if there's an entry today
          hasEntryToday = data.some(entry => 
            format(new Date(entry.created_at), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          );

          // If no entry today, start checking from yesterday
          if (!hasEntryToday) {
            checkDate = subDays(today, 1);
          }

          // Check consecutive days
          for (let i = 0; i < data.length; i++) {
            const entryDate = new Date(data[i].created_at);
            const targetDate = format(checkDate, 'yyyy-MM-dd');
            const currentEntryDate = format(entryDate, 'yyyy-MM-dd');

            if (targetDate === currentEntryDate) {
              currentStreak++;
              checkDate = subDays(checkDate, 1);
            } else {
              break;
            }
          }

          setStreakCount(currentStreak);
        }
      } catch (error) {
        console.error('Error fetching journal stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalStats();
  }, [user]);

  if (isLoading) {
    return <div className="animate-pulse">Loading stats...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Streak and Points Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Streak</p>
            <p className="text-xl font-bold text-white">{streakCount} days</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Points</p>
            <p className="text-xl font-bold text-white">{points}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Level {Math.floor(points / 100)}</span>
          <span>Level {Math.floor(points / 100) + 1}</span>
        </div>
        <Progress value={(points % 100)} className="h-2" />
        <p className="text-xs text-center text-gray-400">
          {100 - (points % 100)} points until next level
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Entries</p>
            <p className="text-xl font-bold text-white">{totalEntries}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Level</p>
            <p className="text-xl font-bold text-white">{Math.floor(points / 100)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 