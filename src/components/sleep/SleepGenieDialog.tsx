
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VoiceButton from '@/components/ui/VoiceButton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';

// Emojis and their corresponding moods
const moods = [
  { emoji: "😊", name: "Happy", color: "bg-yellow-500" },
  { emoji: "😴", name: "Tired", color: "bg-blue-500" },
  { emoji: "😔", name: "Sad", color: "bg-purple-500" },
  { emoji: "😭", name: "Upset", color: "bg-red-500" },
  { emoji: "😴", name: "Sleepy", color: "bg-indigo-500" },
];

interface SleepGenieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SleepGenieDialog = ({ isOpen, onOpenChange }: SleepGenieDialogProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [conversation, setConversation] = useState<{sender: string, text: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [step, setStep] = useState<'mood' | 'conversation'>('mood');

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedMood(null);
        setConversation([]);
        setStep('mood');
      }, 300);
    }
  }, [isOpen]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    
    // Move to conversation step with initial message
    const initialMessage = getInitialMessageForMood(mood);
    setConversation([{ sender: 'ai', text: initialMessage }]);
    setStep('conversation');
    
    toast(`You're feeling ${mood.toLowerCase()}. Let's talk about it.`);
  };
  
  const getInitialMessageForMood = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'happy':
        return "I'm glad you're feeling happy! What made your day special?";
      case 'tired':
      case 'sleepy':
        return "I notice you're feeling tired. What's been affecting your energy today?";
      case 'sad':
        return "I'm sorry to hear you're feeling sad. Would you like to talk about what's on your mind?";
      case 'upset':
        return "I understand you're feeling upset. Is there something specific that happened today?";
      default:
        return "How can I help you with your sleep tonight?";
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    toast("Listening... tell me how I can help with your sleep.");
  };

  const handleStopListening = () => {
    setIsListening(false);
    
    // Simulate user input
    const userMessages = [
      "I'm having trouble falling asleep tonight.",
      "I've been feeling stressed about work lately.",
      "Can you help me relax before bed?",
      "I keep waking up in the middle of the night."
    ];
    const randomUserMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
    
    setConversation(prev => [...prev, { sender: 'user', text: randomUserMessage }]);
    
    // Simulate AI thinking and response
    setIsThinking(true);
    setTimeout(() => {
      const aiResponses = [
        "I understand that falling asleep can be challenging. Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. This helps calm your nervous system.",
        "Work stress can definitely affect your sleep. Consider writing down your worries before bed to clear your mind. Would you like me to guide you through a quick relaxation exercise?",
        "I'd be happy to help you relax. Let's start with a simple body scan. Close your eyes and bring awareness to your toes, gradually moving up through your body, releasing tension as you go.",
        "Waking up at night is common. Make sure your room is cool, dark, and quiet. Avoid looking at the time as it can increase anxiety. Would you like me to recommend a sleep cast for deeper sleep?"
      ];
      const randomAiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setConversation(prev => [...prev, { sender: 'ai', text: randomAiResponse }]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] bg-azleep-dark text-white border-none">
        <DialogHeader>
          {step === 'conversation' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setStep('mood')}
              className="absolute left-4 top-4 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <DialogTitle className="text-center text-white">AI Sleep Genie</DialogTitle>
        </DialogHeader>
        
        {step === 'mood' ? (
          <div className="py-6">
            <h2 className="text-lg font-medium text-center mb-6">How are you feeling today?</h2>
            
            <div className="flex justify-center gap-4">
              {moods.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodSelect(mood.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-full transition-all hover:scale-110 ${mood.color} shadow-lg`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs mt-2 font-medium">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[50vh]">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {conversation.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div 
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-azleep-primary text-white' 
                        : 'bg-muted/20 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-white">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center py-4">
              <VoiceButton 
                onStart={handleStartListening}
                onStop={handleStopListening}
                className="h-16 w-16"
              />
              
              <p className="text-sm text-muted-foreground ml-4">
                {isListening 
                  ? "Listening... Speak clearly"
                  : "Tap the microphone to ask me anything about sleep"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SleepGenieDialog;
