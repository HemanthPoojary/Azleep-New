import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Moon, BookOpen, Headphones, Heart, Star, Cloud, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRelaxationPoints } from '@/hooks/use-relaxation-points';
import SleepGenieButton from '@/components/sleep/SleepGenieButton';
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';

// Emojis and their corresponding moods
const moods = [
  { emoji: "😊", name: "Happy", color: "bg-yellow-500" },
  { emoji: "😴", name: "Tired", color: "bg-blue-500" },
  { emoji: "😔", name: "Sad", color: "bg-purple-500" },
  { emoji: "😭", name: "Upset", color: "bg-red-500" },
  { emoji: "😴", name: "Sleepy", color: "bg-indigo-500" },
];

// Dynamic suggestions based on user's mood
const moodSuggestions = {
  "Happy": [
    {
      text: "Enjoy calming meditation before sleep",
      icon: Star,
      action: "/app/sleep-cast",
    },
    {
      text: "Listen to gentle piano music",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Note your positive thoughts in the journal",
      icon: BookOpen,
      action: "/app/journal",
      params: { mood: "Happy", promptType: "gratitude" }
    },
  ],
  "Tired": [
    {
      text: "Try a guided power nap meditation",
      icon: Cloud,
      action: "/app/sleep-cast",
    },
    {
      text: "Listen to white noise sounds",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Talk to Sleep Genie about your day",
      icon: null, // We'll render a custom button for this
      action: "sleep-genie",
    },
  ],
  "Sad": [
    {
      text: "Talk to Sleep Genie about your feelings",
      icon: null, // We'll render a custom button for this
      action: "sleep-genie",
    },
    {
      text: "Listen to uplifting sleep stories",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Write your thoughts in your journal",
      icon: BookOpen,
      action: "/app/journal",
      params: { mood: "Sad", promptType: "reflect" }
    },
  ],
  "Upset": [
    {
      text: "Try a guided anger release meditation",
      icon: Cloud,
      action: "/app/sleep-cast",
    },
    {
      text: "Listen to calming nature sounds",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Talk to Sleep Genie about what's bothering you",
      icon: null, // We'll render a custom button for this
      action: "sleep-genie",
    },
  ],
  "Sleepy": [
    {
      text: "Listen to a sleep story",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Try a deep sleep meditation",
      icon: Cloud,
      action: "/app/sleep-cast",
    },
    {
      text: "Record your bedtime in your sleep log",
      icon: BookOpen,
      action: "/app/journal",
      params: { mood: "Sleepy", promptType: "dream" }
    },
  ],
  "default": [
    {
      text: "Talk to Sleep Genie about your feelings",
      icon: null, // We'll render a custom button for this
      action: "sleep-genie",
    },
    {
      text: "Listen to comforting rain sounds",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Write your thoughts in your journal",
      icon: BookOpen,
      action: "/app/journal",
    },
  ]
};

const DailyCheckInPage = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number[]>([5]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { user, loading } = useAuth();
  const { addPoints } = useRelaxationPoints();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  // Stress level descriptions
  const getStressDescription = (level: number) => {
    if (level <= 2) return "Very relaxed";
    if (level <= 4) return "Calm";
    if (level <= 6) return "Neutral";
    if (level <= 8) return "Stressed";
    return "Very stressed";
  };
  
  const handleMoodSelect = async (index: number) => {
    setSelectedMood(index);
    const selectedMoodName = moods[index].name;
    
    // Auto-save mood and stress level
    await saveMoodAndStress(selectedMoodName, stressLevel[0]);
  };

  const handleStressChange = async (value: number[]) => {
    setStressLevel(value);
    
    // If a mood is already selected, auto-save the updated stress level
    if (selectedMood !== null) {
      const selectedMoodName = moods[selectedMood].name;
      await saveMoodAndStress(selectedMoodName, value[0]);
    }
  };

  const saveMoodAndStress = async (mood: string, stress: number) => {
    if (!user) return;

    setSaveStatus('saving');
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('mood_records')
        .insert({
          user_id: user.id,
          mood: mood,
          stress_level: stress,
          notes: `Daily check-in: ${mood} (Stress: ${stress}/10 - ${getStressDescription(stress)})`
        });
      
      if (error) throw error;

      // Add relaxation points for completing daily check-in
      await addPoints(10, 'Daily Check-in');
      
      setSaveStatus('saved');
      toast(`Mood and stress level saved! You're feeling ${mood} with ${getStressDescription(stress)} stress.`, {
        duration: 4000,
      });

      // Reset save status after a delay
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error saving mood and stress:', error);
      setSaveStatus('error');
      toast('Failed to save your check-in. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteCheckIn = async () => {
    if (selectedMood === null) {
      toast('Please select your mood first', {
        duration: 3000,
      });
      return;
    }

    const selectedMoodName = moods[selectedMood].name;
    await saveMoodAndStress(selectedMoodName, stressLevel[0]);
    
    // Navigate to suggestions or dashboard
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.action === "sleep-genie") {
      // This will be handled by the SleepGenieButton component
      return;
    }
    
    const path = suggestion.action;
    if (path.startsWith('/')) {
      // If there are params to pass (for journal entries)
      if (suggestion.params) {
        navigate(path, { state: suggestion.params });
      } else {
        navigate(path);
      }
    } else {
      toast("This feature is coming soon!");
    }
  };

  // Get the appropriate suggestions based on selected mood
  const getCurrentSuggestions = () => {
    if (selectedMood === null) {
      return moodSuggestions.default;
    }
    const moodName = moods[selectedMood].name;
    return moodSuggestions[moodName as keyof typeof moodSuggestions];
  };

  // Render a suggestion button based on the suggestion data
  const renderSuggestionButton = (suggestion: any, index: number) => {
    if (suggestion.action === "sleep-genie") {
      return (
        <SleepGenieButton 
          key={index}
          label={suggestion.text}
          className="w-full py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-left justify-start text-lg"
        />
      );
    }
    
    return (
      <Button
        key={index}
        variant="outline"
        onClick={() => handleSuggestionClick(suggestion)}
        className="w-full py-6 bg-white/5 border-white/10 hover:bg-white/10 text-left justify-start text-lg"
      >
        {suggestion.icon && <suggestion.icon className="mr-3 h-6 w-6" />}
        {suggestion.text}
      </Button>
    );
  };

  return (
    <PageContainer>
      <div className="w-full max-w-3xl mx-auto px-4 animate-fade-in">
        {/* Auto-save indicator */}
        <div className="flex justify-end mb-4">
          <AutoSaveIndicator 
            status={saveStatus}
            className="text-sm"
          />
        </div>

        {/* Header with greeting */}
        <div className="flex items-center gap-4 mb-10">
          <div className="rounded-full bg-purple-900/50 p-4">
            <Moon className="h-8 w-8 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Good Evening</h1>
            <p className="text-lg text-gray-400">Ready for a good night's sleep?</p>
          </div>
        </div>
        
        {/* Mood selection */}
        <div className="mb-8 bg-azleep-dark/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            How are you feeling tonight?
          </h2>
          
          <div className="flex justify-center gap-4 md:gap-8">
            <TooltipProvider>
              {moods.map((mood, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleMoodSelect(index)}
                      disabled={isLoading}
                      className={`flex flex-col items-center justify-center p-5 rounded-full transition-all ${
                        selectedMood === index 
                          ? `${mood.color} scale-110 shadow-lg` 
                          : 'bg-white/10 hover:bg-white/20'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-azleep-accent/90 text-white border-none animate-fade-in">
                    <p className="font-medium">{mood.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Stress Level Slider */}
        <div className="mb-8 bg-azleep-dark/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            What's your stress level?
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Current level: <span className="text-white font-semibold">{stressLevel[0]}/10</span> - {getStressDescription(stressLevel[0])}
          </p>
          
          <div className="space-y-4">
            <Slider
              value={stressLevel}
              onValueChange={handleStressChange}
              max={10}
              min={1}
              step={1}
              disabled={isLoading}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-gray-400">
              <span>1 - Very relaxed</span>
              <span>10 - Very stressed</span>
            </div>
          </div>
        </div>

        {/* Complete Check-in Button */}
        {selectedMood !== null && (
          <div className="mb-8 text-center">
            <Button
              onClick={handleCompleteCheckIn}
              disabled={isLoading}
              className="px-8 py-3 bg-azleep-accent hover:bg-azleep-accent/80 text-white font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Check-in'
              )}
            </Button>
          </div>
        )}
        
        {/* Suggestions - only shown when a mood is selected */}
        {selectedMood !== null && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Suggested for you</h2>
            
            <div className="space-y-4">
              {getCurrentSuggestions().map((suggestion, index) => 
                renderSuggestionButton(suggestion, index)
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DailyCheckInPage;
