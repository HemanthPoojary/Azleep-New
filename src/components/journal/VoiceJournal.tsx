import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Mic, Send, PenLine, Star, Bot } from 'lucide-react';
import VoiceButton from '@/components/ui/VoiceButton';
import { supabase } from '@/integrations/supabase/client';
import { useRelaxationPoints } from '@/hooks/use-relaxation-points';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';

interface VoiceJournalProps {
  initialMood?: string;
  onEntrySaved?: () => void;
}

const VoiceJournal: React.FC<VoiceJournalProps> = ({ initialMood, onEntrySaved }) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { addPoints } = useRelaxationPoints();

  // Auto-save functionality with debouncing
  const debouncedAutoSave = useCallback(
    (content: string) => {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new timeout for auto-save
      const timeout = setTimeout(async () => {
        if (content.trim().length > 10) { // Only auto-save if there's meaningful content
          setSaveStatus('saving');
          try {
            await saveJournalEntry(content, true); // Pass true for auto-save
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
          }
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      setAutoSaveTimeout(timeout);
    },
    [autoSaveTimeout]
  );

  // Handle input changes with auto-save
  const handleInputChange = (value: string) => {
    setInput(value);
    debouncedAutoSave(value);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  // Initialize conversation based on selected mood
  useEffect(() => {
    if (initialMood) {
      const welcomeMessage = getWelcomeMessageForMood(initialMood);
      setMessages([{ sender: 'genie', text: welcomeMessage }]);
    } else {
      setMessages([{ sender: 'genie', text: "Hello! I'm your AI Sleep & Wellness Assistant. I'm here to help you reflect on your day and explore your thoughts and feelings in a safe space. How are you feeling right now?" }]);
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
        return "Hello! I'm your AI Sleep & Wellness Assistant. I'm glad to hear you're feeling happy! I'd love to explore what brought you joy today and how we can help you carry that positive energy into a restful evening.";
      case 'tired':
      case 'sleepy':
        return "Hello! I'm your AI Sleep & Wellness Assistant. I notice you're feeling tired. Let's talk about what might have contributed to your fatigue today and explore ways to help you get the restorative rest you need.";
      case 'sad':
        return "Hello! I'm your AI Sleep & Wellness Assistant. I'm sorry to hear you're feeling sad. This is a safe space where you can share what's on your mind. I'm here to listen and support you through whatever you're experiencing.";
      case 'upset':
        return "Hello! I'm your AI Sleep & Wellness Assistant. I can see you're feeling upset. Sometimes difficult emotions need space to be acknowledged. Would you like to share what happened today that brought up these feelings?";
      case 'calm':
        return "Hello! I'm your AI Sleep & Wellness Assistant. It's wonderful to hear you're feeling calm. I'd love to learn more about what helped you achieve this peaceful state and how we can nurture this sense of tranquility.";
      case 'anxious':
        return "Hello! I'm your AI Sleep & Wellness Assistant. I notice you're feeling anxious. Anxiety can be challenging, but you're not alone. Let's explore what might be causing these feelings and work through them together.";
      case 'stressed':
        return "Hello! I'm your AI Sleep & Wellness Assistant. I can hear that you're feeling stressed. Stress is our mind's way of telling us something needs attention. What's been weighing most heavily on your thoughts today?";
      default:
        return "Hello! I'm your AI Sleep & Wellness Assistant. I'm here to help you reflect on your day and explore your thoughts and feelings in a safe space. How are you feeling right now?";
    }
  };

  const getResponseForMessage = (userMessage: string, mood?: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Advanced response generation based on context and mood
    if (lowerCaseMessage.includes('bad day') || lowerCaseMessage.includes('terrible') || lowerCaseMessage.includes('awful')) {
      return "I'm really sorry to hear you had such a difficult day. Sometimes life throws challenges our way that feel overwhelming. Would you like to talk about what specifically made today so hard? I'm here to listen without judgment.";
    } else if (lowerCaseMessage.includes('good day') || lowerCaseMessage.includes('great') || lowerCaseMessage.includes('amazing') || lowerCaseMessage.includes('wonderful')) {
      return "That's absolutely wonderful to hear! It sounds like you had a really positive day. What was the highlight that made it so special? I love hearing about the good moments in life.";
    } else if (lowerCaseMessage.includes('stressed') || lowerCaseMessage.includes('anxiety') || lowerCaseMessage.includes('anxious') || lowerCaseMessage.includes('overwhelmed')) {
      return "I can hear that you're dealing with some stress right now. That's completely understandable - we all face overwhelming moments. What's been weighing most heavily on your mind? Sometimes just talking through our concerns can help us see them more clearly.";
    } else if (lowerCaseMessage.includes('tired') || lowerCaseMessage.includes('exhausted') || lowerCaseMessage.includes('drained') || lowerCaseMessage.includes('fatigue')) {
      return "Being tired can really affect how we experience everything else in our day. Have you been getting enough restful sleep lately? Sometimes our energy levels are telling us something important about what our body and mind need.";
    } else if (lowerCaseMessage.includes('work') || lowerCaseMessage.includes('job') || lowerCaseMessage.includes('boss') || lowerCaseMessage.includes('colleague')) {
      return "Work can certainly be a significant source of both satisfaction and stress in our lives. How has your work situation been affecting your overall wellbeing? Are there particular aspects of your job that are especially challenging right now?";
    } else if (lowerCaseMessage.includes('sleep') || lowerCaseMessage.includes('insomnia') || lowerCaseMessage.includes('can\'t sleep')) {
      return "Sleep challenges can be so frustrating and impact every aspect of our day. Have you noticed any patterns with what might be affecting your sleep? Sometimes our minds are processing the day's events and need help winding down.";
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('advice') || lowerCaseMessage.includes('what should i do')) {
      return "I'd be happy to explore this with you. Sometimes the answers we seek are already within us - we just need a safe space to think them through. What feels like the most pressing concern right now that you'd like to focus on?";
    } else if (lowerCaseMessage.includes('family') || lowerCaseMessage.includes('relationship') || lowerCaseMessage.includes('friend')) {
      return "Relationships are such an important part of our emotional wellbeing. They can bring us great joy and sometimes present challenges too. How are your relationships affecting how you're feeling right now?";
    } else if (lowerCaseMessage.includes('lonely') || lowerCaseMessage.includes('alone') || lowerCaseMessage.includes('isolated')) {
      return "Feeling lonely can be really difficult, and I want you to know that those feelings are completely valid. Even when we're surrounded by people, sometimes we can feel disconnected. What would help you feel more connected right now?";
    } else if (userMessage.length < 15) {
      return "I'd love to hear more about that. Could you share a bit more of what's on your mind? I'm here to listen and help you process whatever you're experiencing.";
    } else {
      // Context-aware follow-up questions based on mood and message length
      const thoughtfulResponses = [
        "That sounds like it's really important to you. How do you think this situation might be affecting your sleep and relaxation?",
        "I can see this is something you're putting a lot of thought into. What would it feel like if this concern was resolved?",
        "Thank you for sharing that with me. What emotions come up for you when you think about this situation?",
        "It sounds like you're processing a lot right now. How has this been impacting your daily life and wellbeing?",
        "I appreciate you opening up about this. What support do you feel you need most right now?",
        "That gives me a good sense of what you're experiencing. How would you describe your energy levels when dealing with this?",
        "I can hear the complexity in what you're sharing. What aspects of this situation feel most within your control?",
        "It sounds like you're really reflecting deeply on this. What would your ideal outcome look like?",
      ];
      
      // Choose response based on mood context
      if (mood === 'sad' || mood === 'upset') {
        return "I can hear that this is weighing heavily on you. It's okay to feel sad about difficult situations. What would help you feel a little lighter right now?";
      } else if (mood === 'anxious' || mood === 'stressed') {
        return "I notice you mentioned feeling anxious earlier. How is this situation contributing to those feelings? Sometimes breaking things down can make them feel more manageable.";
      } else if (mood === 'happy') {
        return "I love that you started our conversation feeling happy, and it sounds like you have a lot to reflect on. How can we make sure you maintain that positive energy?";
      }
      
      return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
    }
  };

  // Enhanced save function with auto-save indicator
  const saveJournalEntry = async (content: string, isAutoSave = false) => {
    if (!content.trim()) return false;
    
    try {
      if (!isAutoSave) {
        setSaveStatus('saving');
      }
      
      const guestId = "guest_" + Math.random().toString(36).substring(2, 15);
      
      const { error, data } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user?.id || guestId,
          content,
          mood: initialMood || 'Reflective',
          title: `Journal conversation - ${new Date().toLocaleDateString()}`
        });
      
      if (error) {
        console.error('Supabase error details:', error);
        if (!isAutoSave) {
          toast.error("Could not save journal entry: " + error.message);
          setSaveStatus('error');
        }
        return false;
      }
      
      // Add relaxation points for journaling
      if (user && content.length > 50) {
        await addPoints(15, 'Journal Entry');
      }
      
      if (!isAutoSave) {
        toast.success("Journal entry saved successfully!");
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
      
      if (onEntrySaved) {
        onEntrySaved();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      if (!isAutoSave) {
        toast.error("Failed to save your journal entry");
        setSaveStatus('error');
      }
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    // Clear auto-save timeout since we're manually saving
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
    
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
        await saveJournalEntry(userMessage, false); // Manual save
      } catch (error) {
        console.error("Error saving journal entry:", error);
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

  return (
    <div className="flex flex-col h-full">
      {/* Auto-save indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-azleep-accent" />
          <h3 className="text-lg font-semibold text-white">AI Sleep & Wellness Assistant</h3>
        </div>
        <AutoSaveIndicator 
          status={saveStatus}
          className="text-sm"
        />
      </div>

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
              {message.sender === 'genie' && (
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-3 w-3 text-azleep-accent" />
                  <span className="text-xs text-azleep-accent font-medium">Sleep Genie</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-3 w-3 text-azleep-accent" />
                <span className="text-xs text-azleep-accent font-medium">Sleep Genie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-azleep-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-azleep-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-azleep-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-400">thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 min-h-[60px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <VoiceButton
              onStart={handleVoiceStart}
              onStop={handleVoiceStop}
              className="h-12 w-12"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 bg-azleep-accent hover:bg-azleep-accent/80 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoiceJournal;
