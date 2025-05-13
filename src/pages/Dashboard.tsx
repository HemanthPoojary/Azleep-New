
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Mic, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNudge, setShowNudge] = useState(false);
  const [relaxPoints, setRelaxPoints] = useState(42); // Example points
  const userName = "User"; // In a real app, this would come from user state
  const isMobile = useIsMobile();
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  const handleStillAwake = () => {
    setShowNudge(true);
  };
  
  const handlePlaySleepCast = () => {
    navigate('/sleep-cast');
    // Add points when user interacts with the app
    setRelaxPoints(prev => Math.min(prev + 5, 100));
  };

  return (
    <PageContainer>
      <div className="mb-6 space-y-2 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-azleep-text">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"></span> 
          Mood: Calm
        </p>
      </div>
      
      <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Button 
          variant="outline" 
          size="lg" 
          className="sleep-card h-20 justify-start hover-scale"
          onClick={() => navigate('/voice')}
        >
          <Mic className="h-6 w-6 mr-4 text-azleep-primary" />
          <span className="text-lg">Talk to AI Sleep Genie</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="sleep-card h-20 justify-start hover-scale"
          onClick={handlePlaySleepCast}
        >
          <Music className="h-6 w-6 mr-4 text-azleep-secondary" />
          <span className="text-lg">Play Sleep Cast</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="sleep-card h-20 justify-start hover-scale md:col-span-2 lg:col-span-1"
          onClick={handleStillAwake}
        >
          <Moon className="h-6 w-6 mr-4 text-azleep-accent" />
          <span className="text-lg">I'm Still Awake</span>
        </Button>
      </div>
      
      <div className="mt-8 max-w-md mx-auto md:mx-0">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-azleep-text">Relaxation Points</span>
          <span className="text-sm text-azleep-primary">{relaxPoints}/100</span>
        </div>
        <Progress value={relaxPoints} className="h-2" />
      </div>
      
      {/* Late-Night Nudge Alert */}
      <AlertDialog open={showNudge} onOpenChange={setShowNudge}>
        <AlertDialogContent className="bg-gradient-sleep border-white/10 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-azleep-text">It's late!</AlertDialogTitle>
            <AlertDialogDescription>
              Let's try a sleep cast to unwind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-azleep-text">
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-azleep-accent text-white hover:bg-azleep-accent/90"
              onClick={handlePlaySleepCast}
            >
              Play Sleep Cast
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default Dashboard;
