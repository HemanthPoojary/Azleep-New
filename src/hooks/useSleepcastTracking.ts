import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface SleepcastTrackingProps {
  sleepcastId: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useSleepcastTracking = ({ 
  sleepcastId, 
  isPlaying, 
  audioRef 
}: SleepcastTrackingProps) => {
  const { user } = useAuth();
  const progressTimeoutRef = useRef<NodeJS.Timeout>();

  // Track playback progress every 30 seconds
  useEffect(() => {
    if (!user || !isPlaying || !audioRef.current) return;

    const saveProgress = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      const progressSeconds = Math.floor(audio.currentTime);
      const duration = Math.floor(audio.duration) || 0;
      const completed = progressSeconds > 0 && (progressSeconds >= duration - 10); // Mark as completed if within 10 seconds of end

      try {
        await supabase
          .from('user_sleepcast_history')
          .insert({
            user_id: user.id,
            sleepcast_id: sleepcastId,
            progress_seconds: progressSeconds,
            completed
          });
      } catch (error) {
        console.error('Error tracking sleepcast progress:', error);
      }
    };

    // Save progress every 30 seconds
    const intervalId = setInterval(saveProgress, 30000);

    // Save progress when audio ends
    const handleAudioEnd = () => {
      clearInterval(intervalId);
      saveProgress();
      toast.success('Sleep cast completed! Sweet dreams 🌙');
    };

    audioRef.current.addEventListener('ended', handleAudioEnd);

    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [user, sleepcastId, isPlaying, audioRef]);

  // Save progress when component unmounts or sleepcast changes
  useEffect(() => {
    return () => {
      if (user && audioRef.current && sleepcastId) {
        const audio = audioRef.current;
        const progressSeconds = Math.floor(audio.currentTime);
        
        if (progressSeconds > 0) {
          // Fire and forget - don't await in cleanup
          supabase
            .from('user_sleepcast_history')
            .insert({
              user_id: user.id,
              sleepcast_id: sleepcastId,
              progress_seconds: progressSeconds,
              completed: false
            })
            .then(({ error }) => {
              if (error) console.error('Error saving final progress:', error);
            });
        }
      }
    };
  }, [user, sleepcastId]);
}; 