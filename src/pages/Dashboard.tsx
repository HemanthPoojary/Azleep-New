
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Mic, Music, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import NightStats from '@/components/sleep/NightStats';
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
import { RedirectToLanding } from "@/components/RedirectToLanding";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock sleep data
const mockData = [
  { day: 'Mon', sleepHours: 6.5, stressLevel: 65 },
  { day: 'Tue', sleepHours: 7.2, stressLevel: 58 },
  { day: 'Wed', sleepHours: 6.8, stressLevel: 62 },
  { day: 'Thu', sleepHours: 7.5, stressLevel: 45 },
  { day: 'Fri', sleepHours: 8.1, stressLevel: 40 },
  { day: 'Sat', sleepHours: 7.8, stressLevel: 35 },
  { day: 'Sun', sleepHours: 7.0, stressLevel: 52 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNudge, setShowNudge] = useState(false);
  const [relaxPoints, setRelaxPoints] = useState(42);
  const [showSleepQuestions, setShowSleepQuestions] = useState(true);
  const [sleepHours, setSleepHours] = useState<string>("8");
  const [sleepQuality, setSleepQuality] = useState<string>("good");
  const userName = "User";
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
    navigate('/app/sleep-cast');
    // Add points when user interacts with the app
    setRelaxPoints(prev => Math.min(prev + 5, 100));
  };

  const handleSleepQuestionsSubmit = () => {
    toast.success("Thanks for sharing your sleep data!");
    setShowSleepQuestions(false);
  };

  return (
    <>
      {/* Redirect component */}
      <RedirectToLanding />
      
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

        {/* Daily Sleep Questions Dialog */}
        <AlertDialog open={showSleepQuestions} onOpenChange={setShowSleepQuestions}>
          <AlertDialogContent className="bg-gradient-to-br from-azleep-dark to-azleep-primary/30 border-white/10 max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-azleep-text text-xl mb-2">Good Morning Sleepyhead! 😴</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-300">
                Let's track your sleep to help you rest better tonight!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-3">
                <label className="block text-white font-medium">How many hours did you sleep last night?</label>
                <div className="flex gap-3 justify-around">
                  {["4", "5", "6", "7", "8", "9+"].map((hour) => (
                    <button 
                      key={hour}
                      onClick={() => setSleepHours(hour)}
                      className={`rounded-full w-10 h-10 flex items-center justify-center transition-all ${
                        sleepHours === hour 
                          ? "bg-azleep-accent scale-110 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white font-medium">How was your sleep quality?</label>
                <div className="flex gap-3 justify-around">
                  {[
                    { value: "bad", emoji: "😫", label: "Bad" },
                    { value: "okay", emoji: "😐", label: "Okay" },
                    { value: "good", emoji: "😊", label: "Good" },
                    { value: "great", emoji: "🤩", label: "Great" }
                  ].map((quality) => (
                    <button 
                      key={quality.value}
                      onClick={() => setSleepQuality(quality.value)}
                      className={`flex flex-col items-center rounded-lg p-2 transition-all ${
                        sleepQuality === quality.value 
                          ? "bg-azleep-accent/80 scale-110"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-2xl mb-1">{quality.emoji}</span>
                      <span className="text-xs">{quality.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={handleSleepQuestionsSubmit}
                className="bg-azleep-accent text-white hover:bg-azleep-accent/90 w-full"
              >
                Save Sleep Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="sleep-card h-20 justify-start hover-scale"
            onClick={() => navigate('/app/voice')}
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
        
        {/* Sleep Stats Section (moved from StatsPage) */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-azleep-text">Sleep Overview</h2>
            <NightStats 
              lastSessionDate="Today" 
              completedSessions={12} 
              totalMinutes={480} 
            />
          </div>
          
          <div className="sleep-card h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" tick={{ fill: '#e8eaf6' }} />
                <YAxis tick={{ fill: '#e8eaf6' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    borderColor: '#3f51b5',
                    color: '#e8eaf6' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sleepHours" 
                  name="Sleep (hours)"
                  stroke="#3f51b5" 
                  strokeWidth={2} 
                  dot={{ fill: '#3f51b5', r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="stressLevel" 
                  name="Stress Level"
                  stroke="#6a11cb" 
                  strokeWidth={2} 
                  dot={{ fill: '#6a11cb', r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="sleep-card">
              <h3 className="mb-2 text-lg font-semibold text-azleep-text">Average Sleep</h3>
              <p className="text-3xl font-bold text-azleep-primary">7.2 hrs</p>
              <p className="mt-2 text-sm text-muted-foreground">
                5% improvement from last week
              </p>
            </div>
            
            <div className="sleep-card">
              <h3 className="mb-2 text-lg font-semibold text-azleep-text">Stress Reduction</h3>
              <p className="text-3xl font-bold text-azleep-accent">12%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your voice patterns show decreased stress
              </p>
            </div>
            
            <div className="sleep-card">
              <h3 className="mb-2 text-lg font-semibold text-azleep-text">Sleep Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                Try the "Night Forest Meditation" sleep cast tonight for optimal results.
              </p>
            </div>
          </div>
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
    </>
  );
};

export default Dashboard;
