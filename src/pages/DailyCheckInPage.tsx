
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Moon, BookOpen, Headphones, MessageCircle, Heart, Star, Cloud } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Happy mood suggestions
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
      action: "#",
    },
  ],
  // Tired mood suggestions
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
      icon: MessageCircle,
      action: "/app/voice",
    },
  ],
  // Sad mood suggestions
  "Sad": [
    {
      text: "Talk to Sleep Genie about your feelings",
      icon: MessageCircle,
      action: "/app/voice",
    },
    {
      text: "Listen to uplifting sleep stories",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Write your thoughts in your journal",
      icon: BookOpen,
      action: "#",
    },
  ],
  // Upset mood suggestions
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
      icon: MessageCircle,
      action: "/app/voice",
    },
  ],
  // Sleepy mood suggestions
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
      action: "#",
    },
  ],
  // Default suggestions if no mood is selected
  "default": [
    {
      text: "Talk to Sleep Genie about your feelings",
      icon: MessageCircle,
      action: "/app/voice",
    },
    {
      text: "Listen to comforting rain sounds",
      icon: Headphones,
      action: "/app/sleep-cast",
    },
    {
      text: "Write your thoughts in your journal",
      icon: BookOpen,
      action: "#",
    },
  ]
};

const DailyCheckInPage = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  
  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    toast(`You're feeling ${moods[index].name} tonight`);
  };

  const handleSuggestionClick = (path: string) => {
    if (path.startsWith('/')) {
      navigate(path);
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
              {getCurrentSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion.action)}
                  className="w-full py-6 bg-white/5 border-white/10 hover:bg-white/10 text-left justify-start text-lg"
                >
                  <suggestion.icon className="mr-3 h-6 w-6" />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DailyCheckInPage;
