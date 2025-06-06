import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export interface JournalStats {
  total: number;
  thisMonth: number;
  currentStreak: number;
  longestStreak: number;
  moodDistribution: Array<{
    mood: string;
    count: number;
    color: string;
  }>;
  last7Days: Array<{
    day: string;
    hasEntry: boolean;
  }>;
}

const moodColors = {
  'Peaceful': 'bg-blue-500',
  'Grateful': 'bg-green-500',
  'Reflective': 'bg-purple-500',
  'Anxious': 'bg-amber-500',
  'Tired': 'bg-red-500',
  'Sad': 'bg-indigo-500',
  'Neutral': 'bg-gray-500',
  'Happy': 'bg-yellow-500',
  'Mixed': 'bg-pink-500'
};

export const useJournalStats = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch journal stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['journalStats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      // Get all journal entries
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const total = entries?.length || 0;
      const thisMonth = entries?.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate >= monthStart && entryDate <= monthEnd;
      }).length || 0;

      // Calculate mood distribution
      const moodCounts: Record<string, number> = {};
      entries?.forEach(entry => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });

      const moodDistribution = Object.entries(moodCounts)
        .map(([mood, count]) => ({
          mood,
          count,
          color: moodColors[mood as keyof typeof moodColors] || 'bg-gray-500'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate last 7 days entries
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const hasEntry = entries?.some(entry => 
          format(new Date(entry.created_at), 'yyyy-MM-dd') === dateStr
        );
        return {
          day: format(date, 'EEE'),
          hasEntry
        };
      });

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      for (let i = 0; i < 7; i++) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const hasEntry = entries?.some(entry => 
          format(new Date(entry.created_at), 'yyyy-MM-dd') === dateStr
        );

        if (hasEntry) {
          tempStreak++;
          if (i === 0) currentStreak = tempStreak;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      return {
        total,
        thisMonth,
        currentStreak,
        longestStreak,
        moodDistribution,
        last7Days
      };
    },
    enabled: !!user
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('journal_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({ queryKey: ['journalStats', user.id] });
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [user, queryClient]);

  return {
    stats: stats || {
      total: 0,
      thisMonth: 0,
      currentStreak: 0,
      longestStreak: 0,
      moodDistribution: [],
      last7Days: Array.from({ length: 7 }, (_, i) => ({
        day: format(subDays(new Date(), 6 - i), 'EEE'),
        hasEntry: false
      }))
    },
    isLoading
  };
}; 