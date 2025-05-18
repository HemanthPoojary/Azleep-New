import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Mic, Send, PenLine, Star } from 'lucide-react';
import VoiceButton from '@/components/ui/VoiceButton';
import { supabase } from '@/integrations/supabase/client';

interface VoiceJournalProps {
  initialMood?: string;
  onEntrySaved?: () => void;
}

const VoiceJournal: React.FC<VoiceJournalProps> = ({ initialMood, onEntrySaved }) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize conversation based on selected mood
  useEffect(() => {
    if (initialMood) {
      const welcomeMessage = getWelcomeMessageForMood(initialMood);
      setMessages([{ sender: 'genie', text: welcomeMessage }]);
    } else {
      setMessages([{ sender: 'genie', text: "Welcome to your evening journal. How are you feeling tonight?" }]);
    }
  }, [initialMood]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessageForMood = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return "I'm glad to hear you're feeling happy! Would you like to share what made you feel this way today?";
      case 'tired':
      case 'sleepy':
        return "I notice you're feeling tired. Let's reflect on what might have contributed to your fatigue today.";
      case 'sad':
        return "I'm sorry to hear you're feeling sad. Would it help to talk about what's on your mind?";
      case 'upset':
        return "I see you're feeling upset. Would you like to share what happened today that might have triggered these feelings?";
      case 'calm':
        return "It's nice to hear you're feeling calm. What helped you achieve this peaceful state today?";
      case 'anxious':
        return "I notice you're feeling anxious. Let's explore what might be causing these feelings and how we can address them.";
      case 'stressed':
        return "I see you're feeling stressed. Would you like to talk about what's causing this stress and how we might manage it?";
      default:
        return "Welcome to your evening journal. How are you feeling tonight?";
    }
  };

  const getResponseForMessage = (userMessage: string, mood?: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Simple keyword detection
    if (lowerCaseMessage.includes('bad day') || lowerCaseMessage.includes('terrible')) {
      return "I'm sorry to hear that. What specifically made today difficult for you?";
    } else if (lowerCaseMessage.includes('good day') || lowerCaseMessage.includes('great')) {
      return "That's wonderful! What was the highlight of your day?";
    } else if (lowerCaseMessage.includes('stressed') || lowerCaseMessage.includes('anxiety')) {
      return "Stress can be challenging. What do you think is contributing to these feelings?";
    } else if (lowerCaseMessage.includes('tired') || lowerCaseMessage.includes('exhausted')) {
      return "Being tired can affect everything. Have you noticed any patterns with your sleep or energy levels?";
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('advice')) {
      return "I'd be happy to help. What specific aspect of your sleep or wellbeing would you like to explore?";
    } else if (userMessage.length < 10) {
      return "Could you share a bit more about that? I'm here to listen.";
    } else {
      // Generic follow-up questions based on mood
      const followUps = [
        "How did that make you feel?",
        "Would you like to explore this further?",
        "Is there anything else on your mind about this?",
        "How might this affect your sleep tonight?",
        "What would help you feel more at ease about this?",
      ];
      return followUps[Math.floor(Math.random() * followUps.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    
    // Simulate AI thinking
    setTimeout(async () => {
      // Add AI response
      const aiResponse = getResponseForMessage(userMessage, initialMood);
      setMessages(prev => [...prev, { sender: 'genie', text: aiResponse }]);
      
      // Save the conversation entry
      try {
        const success = await saveJournalEntry(userMessage);
        if (success && onEntrySaved) {
          onEntrySaved();
        }
      } catch (error) {
        console.error("Error saving journal entry:", error);
        toast.error("Could not save your journal entry. Please try again.");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleVoiceStart = () => {
    setIsRecording(true);
    toast("Listening... speak clearly.");
  };

  const handleVoiceStop = () => {
    setIsRecording(false);
    
    // Simulate voice transcription (in a real app, this would use a voice recognition API)
    setIsLoading(true);
    setTimeout(() => {
      const placeholderTexts = [
        "Today was quite challenging at work, but I managed to get through it.",
        "I'm feeling a bit tired, but overall it was a good day.",
        "I had a great conversation with an old friend today.",
        "I'm looking forward to getting some rest tonight.",
        "I'm worried about my presentation tomorrow."
      ];
      
      const transcribedText = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];
      setInput(transcribedText);
      setIsLoading(false);
      toast("Voice captured! You can edit before sending.");
    }, 1500);
  };

  const saveJournalEntry = async (content: string) => {
    if (!content.trim()) return false;
    
    try {
      console.log("Attempting to save journal entry");
      console.log("Content:", content.substring(0, 20) + "...");
      console.log("Mood:", initialMood || 'Reflective');
      
      const guestId = "guest_" + Math.random().toString(36).substring(2, 15);
      
      const { error, data } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user?.id || guestId, // Use user ID if logged in, otherwise use a guest ID
          content,
          mood: initialMood || 'Reflective',
          title: `Journal conversation - ${new Date().toLocaleDateString()}`
        });
      
      if (error) {
        console.error('Supabase error details:', error);
        toast.error("Could not save journal entry: " + error.message);
        return false;
      }
      
      console.log("Journal entry saved successfully:", data);
      toast.success("Journal entry saved successfully!");
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error("Failed to save your journal entry");
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-azleep-primary text-white' 
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/10'
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-azleep-primary animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-azleep-primary animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-azleep-primary animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/10">
        <div className="flex items-center p-2">
          <VoiceButton 
            onStart={handleVoiceStart}
            onStop={handleVoiceStop}
            className="mr-2"
          />
          
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your day..."
            className="flex-1 h-12 py-3 resize-none bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <Button 
            onClick={handleSendMessage}
            className="bg-azleep-primary hover:bg-azleep-primary/80 ml-2"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
      
      {/* Journal rating (optional) */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-white/70">Rate today's reflection</div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button 
              key={star}
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white/70 hover:text-yellow-400"
            >
              <Star className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceJournal;
