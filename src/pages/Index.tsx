
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/layout/PageContainer';
import SleepCastCard from '@/components/sleep/SleepCastCard';
import MoodTracker from '@/components/mood/MoodTracker';
import NightStats from '@/components/sleep/NightStats';
import LateNightNudge from '@/components/sleep/LateNightNudge';
import { toast } from '@/components/ui/sonner';

const sleepCasts = [
  {
    id: '1',
    title: 'Night Forest Meditation',
    description: 'Calm your mind with the soothing sounds of a forest at night. Perfect for winding down.',
    duration: '15 min',
    category: 'Nature',
  },
  {
    id: '2',
    title: 'Ancient Tamil Folklore',
    description: 'Travel back in time with ancient stories from Tamil tradition, narrated in a soothing voice.',
    duration: '20 min',
    category: 'Folklore',
  },
  {
    id: '3',
    title: 'Ocean Waves Journey',
    description: 'Let the rhythm of ocean waves guide you to a peaceful sleep state.',
    duration: '25 min',
    category: 'Nature',
  },
];

const Index = () => {
  const handlePlaySleepCast = (id: string, title: string) => {
    // In a real app, this would trigger the actual audio player
    toast(`Playing "${title}"`, {
      description: "Adjusting to your current mood and preferences...",
    });
  };

  return (
    <PageContainer>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-azleep-text">Good evening</h1>
        <p className="text-muted-foreground">Ready for better sleep tonight?</p>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-azleep-text">Sleep Casts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sleepCasts.map(cast => (
            <SleepCastCard 
              key={cast.id} 
              {...cast} 
              onPlay={() => handlePlaySleepCast(cast.id, cast.title)}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-azleep-text">Track Your Mood</h2>
        <MoodTracker />
      </div>
      
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <NightStats 
          lastSessionDate="Yesterday"
          completedSessions={3}
          totalMinutes={65}
        />
        <LateNightNudge />
      </div>
    </PageContainer>
  );
};

export default Index;
