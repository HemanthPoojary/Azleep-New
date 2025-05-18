
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Mic, Music, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import NightStats from '@/components/sleep/NightStats';
import PersonalizedNudge from '@/components/sleep/PersonalizedNudge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
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

// Session storage key for sleep questions
const SLEEP_QUESTIONS_KEY = 'azleep_sleep_questions_answered';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNudge, setShowNudge] = useState(false);
  const [relaxPoints, setRelaxPoints] = useState(42);
  const [showSleepQuestions, setShowSleepQuestions] = useState(false);
  const [sleepHours, setSleepHours] = useState<string>("8");
  const [sleepQuality, setSleepQuality] = useState<string>("good");
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  // Fetch sleep records
  const { data: sleepData, isLoading: isSleepDataLoading } = useQuery({
    queryKey: ['sleepRecords', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .order('sleep_date', { ascending: false })
        .limit(7);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch mood records for stress level
  const { data: moodData, isLoading: isMoodDataLoading } = useQuery({
    queryKey: ['moodRecords', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('mood_records')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(7);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Transform data for the chart
  const chartData = React.useMemo(() => {
    if (!sleepData || !moodData) return [];

    const dateMap = new Map();
    
    // First add sleep data
    sleepData.forEach(record => {
      const date = new Date(record.sleep_date);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      dateMap.set(record.sleep_date, {
        day,
        sleepHours: record.sleep_duration,
        date: record.sleep_date
      });
    });
    
    // Then add mood data
    moodData.forEach(record => {
      const date = new Date(record.recorded_at);
      const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      
      const existingData = dateMap.get(dateStr) || { 
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr
      };
      
      existingData.stressLevel = record.stress_level;
      dateMap.set(dateStr, existingData);
    });
    
    // Convert map to array and sort by date
    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sleepData, moodData]);
  
  // Check if sleep questions need to be shown (once per session)
  useEffect(() => {
    const hasAnsweredQuestions = sessionStorage.getItem(SLEEP_QUESTIONS_KEY);
    if (!hasAnsweredQuestions && user) {
      setShowSleepQuestions(true);
    }
  }, [user]);
  
  const handleStillAwake = () => {
    setShowNudge(true);
  };
  
  const handlePlaySleepCast = () => {
    navigate('/app/sleep-cast');
    // Add points when user interacts with the app
    setRelaxPoints(prev => Math.min(prev + 5, 100));
  };

  const handleSleepQuestionsSubmit = async () => {
    if (!user) return;
    
    try {
      // Parse sleep hours as a number
      const duration = parseFloat(sleepHours);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have a record for today
      const { data: existingRecord } = await supabase
        .from('sleep_records')
        .select('id')
        .eq('user_id', user.id)
        .eq('sleep_date', today)
        .single();
      
      if (existingRecord) {
        // Update existing record
        await supabase
          .from('sleep_records')
          .update({ 
            sleep_duration: duration,
            sleep_quality: sleepQuality
          })
          .eq('id', existingRecord.id);
      } else {
        // Insert new record
        await supabase
          .from('sleep_records')
          .insert({ 
            user_id: user.id,
            sleep_duration: duration,
            sleep_quality: sleepQuality,
            sleep_date: today
          });
      }
      
      toast.success("Thanks for sharing your sleep data!");
      setShowSleepQuestions(false);
      // Mark sleep questions as answered for this session
      sessionStorage.setItem(SLEEP_QUESTIONS_KEY, 'true');
    } catch (error) {
      console.error("Error saving sleep data:", error);
      toast.error("Failed to save sleep data. Please try again.");
    }
  };

  // Calculate sleep stats
  const sleepStats = React.useMemo(() => {
    if (!sleepData || sleepData.length === 0) {
      return {
        lastSessionDate: "No data",
        completedSessions: 0,
        totalMinutes: 0,
        avgSleepHours: 0,
        improvementPercent: 0
      };
    }
    
    const completedSessions = sleepData.length;
    const totalMinutes = sleepData.reduce((sum, record) => sum + (record.sleep_duration * 60), 0);
    
    // Calculate average sleep time
    const avgSleepHours = totalMinutes / completedSessions / 60;
    
    // Calculate improvement percentage (compare last 3 days with previous 4 days)
    let improvementPercent = 0;
    if (sleepData.length > 3) {
      const recentSleep = sleepData.slice(0, 3);
      const previousSleep = sleepData.slice(3, 7);
      
      if (previousSleep.length > 0) {
        const recentAvg = recentSleep.reduce((sum, record) => sum + record.sleep_duration, 0) / recentSleep.length;
        const previousAvg = previousSleep.reduce((sum, record) => sum + record.sleep_duration, 0) / previousSleep.length;
        
        improvementPercent = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
      }
    }
    
    // Format last session date
    const lastSessionDate = new Date(sleepData[0]?.sleep_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return {
      lastSessionDate,
      completedSessions,
      totalMinutes: Math.round(totalMinutes),
      avgSleepHours: avgSleepHours.toFixed(1),
      improvementPercent
    };
  }, [sleepData]);

  // Extract user details for personalized nudges
  const userName = user?.first_name || "there";
  const userAge = user?.age || undefined;
  const userOccupation = user?.occupation || undefined;
  const userSleepIssues = user?.sleep_issues || undefined;

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
            Mood: {moodData && moodData[0]?.mood || "Calm"}
          </p>
        </div>

        {/* Daily Sleep Questions Dialog */}
        <AlertDialog open={showSleepQuestions} onOpenChange={setShowSleepQuestions}>
          <AlertDialogContent className="bg-gradient-to-br from-azleep-dark to-azleep-primary/30 border-white/10 max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-azleep-text text-xl mb-2">{getGreeting()} Sleepyhead! 😴</AlertDialogTitle>
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
        
        {/* Display personalized sleep nudge */}
        <div className="mb-6">
          <PersonalizedNudge 
            age={userAge} 
            occupation={userOccupation} 
            sleepIssues={userSleepIssues} 
          />
        </div>
        
        <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <Button 
            variant="outline" 
            size="lg" 
            className="sleep-card h-20 justify-start hover-scale"
            onClick={() => navigate('/app/check-in')}
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
        
        {/* Sleep Stats Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-azleep-text">Sleep Overview</h2>
            <NightStats 
              lastSessionDate={sleepStats.lastSessionDate} 
              completedSessions={sleepStats.completedSessions} 
              totalMinutes={sleepStats.totalMinutes} 
            />
          </div>
          
          <div className="sleep-card h-64 mb-6">
            {isSleepDataLoading || isMoodDataLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-azleep-text">Loading sleep data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <p className="text-azleep-text mb-2">No sleep data available yet</p>
                <Button 
                  onClick={() => setShowSleepQuestions(true)}
                  className="bg-azleep-accent text-white hover:bg-azleep-accent/90"
                >
                  Add Sleep Data
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="sleep-card">
              <h3 className="mb-2 text-lg font-semibold text-azleep-text">Average Sleep</h3>
              <p className="text-3xl font-bold text-azleep-primary">{sleepStats.avgSleepHours} hrs</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {sleepStats.improvementPercent > 0 
                  ? `${sleepStats.improvementPercent}% improvement from last week` 
                  : sleepStats.improvementPercent < 0 
                    ? `${Math.abs(sleepStats.improvementPercent)}% decrease from last week`
                    : "No change from last week"}
              </p>
            </div>
            
            <div className="sleep-card">
              <h3 className="mb-2 text-lg font-semibold text-azleep-text">Stress Reduction</h3>
              <p className="text-3xl font-bold text-azleep-accent">
                {moodData && moodData.length > 1 
                  ? `${Math.abs(Math.round((moodData[0].stress_level - moodData[1].stress_level) / moodData[1].stress_level * 100))}%` 
                  : "0%"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your voice patterns show {moodData && moodData.length > 1 && moodData[0].stress_level < moodData[1].stress_level ? "decreased" : "increased"} stress
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
