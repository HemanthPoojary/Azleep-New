import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Mic, MicOff, Send, PenLine, Star, Sparkles, Heart } from 'lucide-react';
import VoiceButton from '@/components/ui/VoiceButton';
import { supabase } from '@/integrations/supabase/client';
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';
import { Badge } from '@/components/ui/badge';
import { voiceManager } from '@/lib/voice-manager';

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
  const [mood, setMood] = useState(initialMood || 'Reflective');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | 'idle'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
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

  const handleVoiceStart = async () => {
    setIsRecording(true);
    toast("Listening... speak clearly.");
    
    try {
      const success = await voiceManager.startRecording({
        onSpeechResult: (text) => {
          setInput((prev) => prev + ' ' + text);
        },
        onSpeechStart: () => {
          toast("Started listening...");
        },
        onSpeechEnd: () => {
          toast("Processing your voice...");
        }
      });
      
      if (!success) {
        setIsRecording(false);
        toast.error("Could not start voice recording. Please check your microphone permissions.");
      }
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
      toast.error("Failed to start voice recording. Please try again.");
    }
  };

  const handleVoiceStop = async () => {
    try {
      await voiceManager.stopRecording();
      setIsRecording(false);
      toast("Voice captured! You can edit before sending.");
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      toast.error("Failed to stop recording. Please try again.");
    }
  };

  const saveJournalEntry = async (content: string) => {
    if (!content.trim()) return false;
    
    try {
      console.log("Attempting to save journal entry");
      console.log("Content:", content.substring(0, 20) + "...");
      console.log("Mood:", mood);
      
      const guestId = "guest_" + Math.random().toString(36).substring(2, 15);
      
      const { error, data } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user?.id || guestId, // Use user ID if logged in, otherwise use a guest ID
          content,
          mood,
          title: `Voice journal - ${new Date().toLocaleDateString()}`
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

  // Auto-save functionality
  useEffect(() => {
    if (!input.trim() || !user) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaveStatus('saving');
      
      try {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: input.trim(),
            title: `Voice journal - ${new Date().toLocaleDateString()}`,
            mood: mood
          });

        if (error) throw error;

        setAutoSaveStatus('saved');
        setLastSaved(new Date());
        
        // Reset status after 3 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
        
      } catch (error) {
        console.error('Auto-save error:', error);
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [input, mood, user]);

  const handleManualSave = async () => {
    if (!input.trim()) {
      toast.error('Please write something first');
      return;
    }

    if (!user) {
      toast.error('Please sign in to save your journal entry');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: input.trim(),
          title: `Voice journal - ${new Date().toLocaleDateString()}`,
          mood: mood
        });

      if (error) throw error;

      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      setInput(''); // Clear input after manual save
      
      if (onEntrySaved) {
        onEntrySaved();
      }

      toast.success('Journal entry saved successfully! ✨', {
        description: `Your ${mood.toLowerCase()} thoughts have been recorded.`
      });

      // Reset status after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setAutoSaveStatus('error');
      toast.error('Failed to save journal entry', {
        description: 'Please try again or check your connection.'
      });
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  const moodOptions = ['Happy', 'Grateful', 'Peaceful', 'Reflective', 'Anxious', 'Tired', 'Sad'];

  return (
    <div className="space-y-6">
      {/* Header with mood selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400" />
          <h3 className="text-xl font-semibold text-white">Voice Journal</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <AutoSaveIndicator 
            status={autoSaveStatus}
            lastSaved={lastSaved}
            isConnected={true}
          />
        </div>
      </div>

      {/* Mood selector */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((moodOption) => (
            <Badge
              key={moodOption}
              variant={mood === moodOption ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                mood === moodOption 
                  ? 'bg-azleep-primary text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              onClick={() => setMood(moodOption)}
            >
              {moodOption}
            </Badge>
          ))}
        </div>
      </div>

      {/* Text area with enhanced styling */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <Textarea
            placeholder={
              initialMood 
                ? `You mentioned feeling ${initialMood.toLowerCase()}. Tell me more about that...` 
                : "What's on your mind? Share your thoughts, feelings, or experiences..."
            }
            className="min-h-[200px] bg-transparent border-none text-white placeholder:text-white/50 resize-none focus:ring-0 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <VoiceButton
            onStart={handleVoiceStart}
            onStop={handleVoiceStop}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          />
          
          {input.trim() && autoSaveStatus === 'idle' && (
            <span className="text-xs text-gray-400">
              Changes saved automatically
            </span>
          )}
        </div>

        <Button
          onClick={handleManualSave}
          disabled={!input.trim() || autoSaveStatus === 'saving'}
          className="bg-azleep-primary hover:bg-azleep-primary/80"
        >
          {autoSaveStatus === 'saving' ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Save Entry
            </>
          )}
        </Button>
      </div>

      {/* Usage hint */}
      <div className="text-xs text-gray-400 text-center">
        💡 Your thoughts are automatically saved as you type. Use manual save to finish and clear the editor.
      </div>
    </div>
  );
};

export default VoiceJournal;
