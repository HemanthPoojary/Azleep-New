
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import VoiceButton from '../ui/VoiceButton';
import { toast } from '@/components/ui/sonner';

const MoodTracker = () => {
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartRecording = () => {
    setIsAnalyzing(true);
    toast("Recording started. Tell us about your day...");
  };

  const handleStopRecording = () => {
    // Simulate API call to analyze mood
    setTimeout(() => {
      const randomStress = Math.floor(Math.random() * 100);
      setStressLevel(randomStress);
      setIsAnalyzing(false);
      
      if (randomStress > 70) {
        toast("Your stress levels seem high. Would you like to try a relaxation exercise?", {
          action: {
            label: "Try Now",
            onClick: () => console.log("User clicked on relaxation exercise")
          }
        });
      } else {
        toast("Voice analysis complete!");
      }
    }, 2000);
  };

  return (
    <div className="sleep-card">
      <h3 className="mb-4 text-lg font-semibold text-azleep-text">Voice Mood Tracker</h3>
      
      {stressLevel !== null && !isAnalyzing && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stress Level</span>
            <span className="text-sm font-medium">{stressLevel}%</span>
          </div>
          <Progress value={stressLevel} className="h-2 bg-muted/30" />
          <p className="mt-2 text-sm text-muted-foreground">
            {stressLevel > 70 
              ? "Your voice patterns indicate high stress levels. Consider a relaxation exercise."
              : stressLevel > 40 
              ? "Moderate stress detected. A sleep cast might help you unwind."
              : "Your stress levels are low. Great job managing your wellbeing!"}
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="mb-6 flex items-center justify-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.4s" }}></div>
          <span className="ml-2 text-sm text-muted-foreground">Analyzing your voice patterns...</span>
        </div>
      )}

      <div className="flex items-center justify-center pt-4">
        <VoiceButton 
          onStart={handleStartRecording} 
          onStop={handleStopRecording} 
        />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isAnalyzing 
            ? "Listening..." 
            : "Tap to track your mood through voice"}
        </p>
      </div>
    </div>
  );
};

export default MoodTracker;
