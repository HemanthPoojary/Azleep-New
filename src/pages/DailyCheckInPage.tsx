
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Moon, BookOpen, Headphones, Heart, Star, Cloud } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SleepGenieButton from '@/components/sleep/SleepGenieButton';

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
  const { user } = useAuth();
  
  const handleMoodSelect = async (index: number) => {
    setSelectedMood(index);
    const selectedMoodName = moods[index].name;
    toast(`You're feeling ${selectedMoodName} tonight`);
    
    // Save the mood selection to the database
    if (user) {
      try {
        const { error } = await supabase
          .from('mood_records')
          .insert({
            user_id: user.id,
            mood: selectedMoodName,
            notes: `Daily check-in: ${selectedMoodName}`
          });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error saving mood:', error);
      }
    }
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
        <div className="mb-12 bg-azleep-dark/50 rounded-xl p-6 shadow-lg">
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
                      className={`flex flex-col items-center justify-center p-5 rounded-full transition-all ${
                        selectedMood === index 
                          ? `${mood.color} scale-110 shadow-lg` 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
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
