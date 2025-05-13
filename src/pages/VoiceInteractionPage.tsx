
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import VoiceButton from '@/components/ui/VoiceButton';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const VoiceInteractionPage = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<{sender: string, text: string}[]>([
    { sender: 'ai', text: 'Hi, I\'m your AI Sleep Genie. How can I help you sleep better tonight?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);

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
    <PageContainer>
      <div className="mb-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-azleep-text">AI Sleep Genie</h1>
      </div>
      
      <div className="flex flex-1 flex-col h-[70vh] md:h-[80vh]">
        <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl bg-azleep-dark/50 p-4 md:p-6">
          {conversation.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div 
                className={`max-w-[80%] md:max-w-[70%] rounded-xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-azleep-primary text-white' 
                    : 'bg-muted/20 text-azleep-text'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-azleep-text">
                <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.2s" }}></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-azleep-primary" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center py-6">
          <VoiceButton 
            onStart={handleStartListening}
            onStop={handleStopListening}
            className="h-16 w-16"
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isListening 
              ? "Listening... Speak clearly"
              : "Tap the microphone to ask me anything about sleep"}
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default VoiceInteractionPage;
