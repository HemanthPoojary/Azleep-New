import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';

// Simple real-time sync for specific tables
export const useRealtimeSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time changes
    const channels = [
      // Sleep tracking changes
      supabase
        .channel('sleep_tracking_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sleep_tracking', filter: `user_id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['sleepRecords', user.id] });
          }
        ),

      // Mood records changes
      supabase
        .channel('mood_records_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'mood_records', filter: `user_id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['moodRecords', user.id] });
          }
        ),

      // Journal entries changes
      supabase
        .channel('journal_entries_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['journalEntries', user.id] });
          }
        ),

      // User profile changes
      supabase
        .channel('user_profiles_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_profiles', filter: `id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
          }
        ),

      // Sleep cast history changes
      supabase
        .channel('sleepcast_history_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_sleepcast_history', filter: `user_id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['sleepcastHistory', user.id] });
          }
        ),
    ];

    // Subscribe to all channels
    channels.forEach(channel => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${channel.topic} real-time updates`);
        }
      });
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, queryClient]);
};

// Auto-save functionality for form data
export const useAutoSaveMood = () => {
  const { user } = useAuth();

  const saveMood = async (mood: string, stressLevel: number = 5, notes: string = '') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mood_records')
        .insert({
          user_id: user.id,
          mood,
          stress_level: stressLevel,
          notes: notes || `Daily check-in: ${mood}`,
        });

      if (error) throw error;
      toast.success('Mood saved successfully!');
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood data');
    }
  };

  return { saveMood };
};

// Auto-save for journal entries
export const useAutoSaveJournal = () => {
  const { user } = useAuth();

  const saveJournalEntry = async (content: string, title?: string, mood?: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: content.trim(),
          title: title || null,
          mood: mood || null,
        });

      if (error) throw error;
      toast.success('Journal entry saved!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry');
    }
  };

  return { saveJournalEntry };
};

// Auto-save for sleep data
export const useAutoSaveSleep = () => {
  const { user } = useAuth();

  const saveSleepData = async (sleepHours: number, sleepQuality: string, notes?: string) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have a record for today
      const { data: existingRecord } = await supabase
        .from('sleep_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('sleep_date', today)
        .maybeSingle();
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('sleep_tracking')
          .update({ 
            sleep_hours: sleepHours,
            sleep_quality: sleepQuality,
            notes: notes || null,
          })
          .eq('id', existingRecord.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('sleep_tracking')
          .insert({ 
            user_id: user.id,
            sleep_hours: sleepHours,
            sleep_quality: sleepQuality,
            sleep_date: today,
            notes: notes || null,
          });
        
        if (error) throw error;
      }
      
      toast.success('Sleep data saved successfully!');
    } catch (error) {
      console.error('Error saving sleep data:', error);
      toast.error('Failed to save sleep data');
    }
  };

  return { saveSleepData };
};

// Track sleepcast playback
export const useTrackSleepcast = () => {
  const { user } = useAuth();

  const trackPlayback = async (sleepcastId: string, progressSeconds: number = 0, completed: boolean = false) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_sleepcast_history')
        .insert({
          user_id: user.id,
          sleepcast_id: sleepcastId,
          progress_seconds: progressSeconds,
          completed,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking sleepcast:', error);
    }
  };

  return { trackPlayback };
}; 