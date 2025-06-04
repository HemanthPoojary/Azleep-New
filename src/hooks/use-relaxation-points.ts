import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface RelaxationPoints {
  total_points: number;
  daily_points: number;
  streak_days: number;
  last_activity_date: string | null;
}

interface UseRelaxationPointsReturn {
  points: RelaxationPoints | null;
  loading: boolean;
  addPoints: (amount: number, activity: string) => Promise<void>;
  getCurrentStreak: () => number;
  getPointsToday: () => number;
}

export const useRelaxationPoints = (): UseRelaxationPointsReturn => {
  const [points, setPoints] = useState<RelaxationPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user's relaxation points
  const loadPoints = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('relaxation_points, daily_points, streak_days, last_activity_date')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading relaxation points:', error);
        return;
      }

      if (data) {
        setPoints({
          total_points: data.relaxation_points || 0,
          daily_points: data.daily_points || 0,
          streak_days: data.streak_days || 0,
          last_activity_date: data.last_activity_date
        });
      }
    } catch (error) {
      console.error('Error in loadPoints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add points for completing activities
  const addPoints = async (amount: number, activity: string) => {
    if (!user || !points) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = points.last_activity_date?.split('T')[0];
      
      // Check if this is a new day
      const isNewDay = lastActivityDate !== today;
      const newDailyPoints = isNewDay ? amount : points.daily_points + amount;
      
      // Calculate streak
      let newStreak = points.streak_days;
      if (isNewDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActivityDate === yesterdayStr) {
          // Continuing streak
          newStreak += 1;
        } else if (lastActivityDate !== today) {
          // Starting new streak
          newStreak = 1;
        }
      }

      // Update database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          relaxation_points: points.total_points + amount,
          daily_points: newDailyPoints,
          streak_days: newStreak,
          last_activity_date: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setPoints({
        total_points: points.total_points + amount,
        daily_points: newDailyPoints,
        streak_days: newStreak,
        last_activity_date: new Date().toISOString()
      });

      // Show toast notification
      toast(`+${amount} relaxation points for ${activity}! 🌟`, {
        duration: 3000,
      });

      // Show streak notification if applicable
      if (isNewDay && newStreak > 1) {
        setTimeout(() => {
          toast(`${newStreak} day streak! Keep it up! 🔥`, {
            duration: 4000,
          });
        }, 1000);
      }

    } catch (error) {
      console.error('Error adding points:', error);
      toast('Failed to add points. Please try again.', {
        duration: 3000,
      });
    }
  };

  // Get current streak
  const getCurrentStreak = (): number => {
    return points?.streak_days || 0;
  };

  // Get points earned today
  const getPointsToday = (): number => {
    if (!points?.last_activity_date) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = points.last_activity_date.split('T')[0];
    
    return lastActivityDate === today ? points.daily_points : 0;
  };

  useEffect(() => {
    loadPoints();
  }, [user]);

  return {
    points,
    loading,
    addPoints,
    getCurrentStreak,
    getPointsToday
  };
}; 