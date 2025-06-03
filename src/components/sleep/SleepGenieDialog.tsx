import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Volume2, VolumeX, Mic } from 'lucide-react';
import vapi from '@/config/vapi';

const SILENCE_TIMEOUT = 5000; // 5 seconds of silence before stopping

const SleepGenieDialog = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [conversation, setConversation] = useState<{sender: string, text: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const callRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation, currentTranscription]);

  // Initialize voice chat when dialog opens
  useEffect(() => {
    if (isOpen && !callRef.current) {
      initializeCall();
    }
  }, [isOpen]);

  // Cleanup when dialog closes or component unmounts
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      hasInitializedRef.current = false;
    }
    return () => {
      cleanup();
      hasInitializedRef.current = false;
    };
  }, [isOpen]);

  const cleanup = () => {
    if (callRef.current) {
      try {
        // Stop any ongoing speech
        callRef.current.stop();
        
        // Remove all event listeners
        const events = ['speech-start', 'speech-end', 'call-start', 'call-end', 'volume-level', 'message', 'error'];
        events.forEach(event => {
          try {
            if (callRef.current && typeof callRef.current.off === 'function') {
              callRef.current.off(event);
            }
          } catch (e) {
            console.error(`Error removing ${event} listener:`, e);
          }
        });
      } catch (e) {
        console.error('Error stopping call:', e);
      }
      callRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setConversation([]);
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentTranscription('');
  };

  const startInitialGreeting = () => {
    if (!hasInitializedRef.current && callRef.current) {
      hasInitializedRef.current = true;
      const welcomeMessage = "Hi, I'm your AI Sleep Genie. How can I help you sleep better tonight?";
      setConversation([{ sender: 'ai', text: welcomeMessage }]);
      
      // Use the say method to speak the welcome message
      try {
        if (typeof callRef.current.say === 'function') {
          callRef.current.say(welcomeMessage);
        }
      } catch (e) {
        console.error('Error saying welcome message:', e);
      }
    }
  };

  const initializeCall = async () => {
    try {
      // Initialize and start immediately
      const call = await vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
      
      if (!call) {
        console.error("Failed to initialize Vapi call");
        toast.error("Sorry, I couldn't start the voice chat. Please try again.");
        return;
      }

      // Cast to any since the SDK doesn't export proper types
      const vapiCall = call as any;
      callRef.current = vapiCall;

      // Set up event listeners
      if (vapiCall && typeof vapiCall.on === 'function') {
        vapiCall.on('speech-start', () => {
          setIsSpeaking(true);
        });

        vapiCall.on('speech-end', () => {
          setIsSpeaking(false);
        });

        vapiCall.on('call-start', () => {
    setIsListening(true);
          toast("Listening...");
          resetSilenceTimeout();
        });

        vapiCall.on('call-end', () => {
          setIsListening(false);
          setCurrentTranscription('');
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        });

        vapiCall.on('volume-level', (volume: number) => {
          // Optional: Use volume level for UI feedback
          console.log('Volume level:', volume);
        });

        vapiCall.on('message', (message: any) => {
          if (message.type === 'transcript') {
            setCurrentTranscription(message.content);
          } else if (message.role === "assistant") {
            setConversation(prev => [...prev, { sender: 'ai', text: message.content }]);
          } else if (message.role === "user") {
            setConversation(prev => [...prev, { sender: 'user', text: message.content }]);
            setCurrentTranscription(''); // Clear transcription when message is finalized
            resetSilenceTimeout();
          }
        });

        vapiCall.on('error', (error: any) => {
          console.error("Vapi error:", error);
          toast.error("Sorry, I had trouble understanding. Could you try again?");
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        });
      }

      // Start the initial greeting
      startInitialGreeting();
    } catch (error) {
      console.error('Error initializing call:', error);
      toast.error("Sorry, I couldn't start the voice chat. Please try again.");
    }
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (callRef.current && isListening) {
        try {
          if (typeof callRef.current.stop === 'function') {
            callRef.current.stop();
            toast("Stopped listening due to silence");
          }
        } catch (e) {
          console.error('Error stopping call:', e);
        }
      }
    }, SILENCE_TIMEOUT);
  };

  const handleVoiceToggle = () => {
    if (!callRef.current) {
      initializeCall();
      return;
    }

    try {
      if (isListening) {
        if (typeof callRef.current.stop === 'function') {
          callRef.current.stop();
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        }
      } else {
        if (typeof callRef.current.start === 'function') {
          callRef.current.start();
        }
      }
    } catch (e) {
      console.error('Error toggling voice:', e);
      toast.error("Sorry, something went wrong. Please try again.");
    }
  };

  const toggleMute = () => {
    if (callRef.current) {
      try {
        const newMutedState = !isMuted;
        if (typeof callRef.current.setMuted === 'function') {
          callRef.current.setMuted(newMutedState);
          setIsMuted(newMutedState);
          toast(newMutedState ? "Voice disabled" : "Voice enabled");
        }
      } catch (e) {
        console.error('Error toggling mute:', e);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[70vh] bg-azleep-dark text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-white">AI Sleep Genie</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
            onClick={toggleMute}
            className="absolute right-4 top-4 text-white"
            >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
        </DialogHeader>
        
          <div className="flex flex-col h-[50vh]">
          <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
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
            
            {/* Live transcription */}
            {currentTranscription && (
              <div className="flex justify-end animate-fade-in">
                <div className="max-w-[80%] rounded-xl px-4 py-2 bg-azleep-primary/50 text-white">
                  <p className="italic">{currentTranscription}</p>
                </div>
              </div>
            )}
              
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
            
          <div className="flex items-center justify-center p-4 border-t border-white/10">
            <Button
              onClick={handleVoiceToggle}
              className={`h-14 w-14 rounded-full transition-all ${
                isListening 
                  ? 'bg-azleep-primary animate-pulse' 
                  : 'bg-muted hover:bg-azleep-primary/80'
              }`}
            >
              <Mic className={`h-6 w-6 ${isListening ? 'text-white' : 'text-white/80'}`} />
            </Button>
              
              <p className="text-sm text-muted-foreground ml-4">
                {isListening 
                  ? "Listening... Speak clearly"
                : isSpeaking
                ? "Speaking..."
                : "Tap the microphone to talk with Sleep Genie"}
              </p>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default SleepGenieDialog;
