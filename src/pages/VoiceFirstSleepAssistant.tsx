import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Waves, Volume2, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { voiceManager } from '@/lib/voice-manager';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Add this at the top of the file, before any imports
declare global {
  interface Window {
    androidDebugLog?: (message: string) => void;
    bridge?: any;
  }
}

// Ambient background colors for different emotional states
const moodColors = {
  calm: 'from-blue-900 to-indigo-950',
  anxious: 'from-purple-900 to-indigo-950',
  tired: 'from-indigo-900 to-blue-950',
  neutral: 'from-slate-900 to-blue-950'
};

// Add this helper function at the top level
const androidLog = (message: string) => {
  // Log to console
  console.log(message);
  
  // Log to Android if available
  if (typeof window.androidDebugLog === 'function') {
    window.androidDebugLog(message);
  }
};

const VoiceFirstSleepAssistant = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<keyof typeof moodColors>('neutral');
  const [messages, setMessages] = useState<Array<{ type: 'ai' | 'user', text: string }>>([]);
  const [transcription, setTranscription] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [lastBackPress, setLastBackPress] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);
  const [status, setStatus] = useState<'initializing' | 'ready' | 'listening' | 'error'>('initializing');

  // Handle double-click
  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime < 300) { // Double click within 300ms
      cleanup();
      navigate('/app/dashboard');
    }
    setLastClickTime(now);
  }, [lastClickTime, navigate]);

  // Handle back button and double-tap
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      const now = Date.now();
      
      if (now - lastBackPress < 300) { // Double tap within 300ms
        cleanup();
        window.removeEventListener('popstate', handleBackButton);
        navigate('/app/dashboard');
      } else {
        setLastBackPress(now);
        toast('Double-click anywhere or press back again to exit');
      }
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [lastBackPress, navigate]);

  const cleanup = async () => {
    if (!isMountedRef.current) return;
    
    try {
      // Cancel all speech synthesis
      window.speechSynthesis.cancel();
      
      // Stop voice recording
      await voiceManager.stopRecording();
      
      // Clear all timeouts
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      
      // Reset all state
      setIsListening(false);
      setMessages([]);
      setIsInitialized(false);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  // Text-to-speech function with enhanced voice
  const speak = useCallback(async (text: string) => {
    if (!isMountedRef.current) return;
    
    setMessages(prev => [...prev, { type: 'ai', text }]);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Use Web Speech API for text-to-speech with better voice settings
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 0.9; // Slightly louder
    
    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Natural') || 
      voice.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  // Handle user speech input with enhanced navigation and Android logging
  const handleSpeechInput = useCallback((text: string) => {
    if (!isMountedRef.current) return;
    
    setLastInteraction(Date.now());
    setTranscription(text);
    setMessages(prev => [...prev, { type: 'user', text }]);

    // Enhanced logging for Android
    androidLog(`Speech Input: ${text}`);

    const lowerText = text.toLowerCase().trim();
    androidLog(`Processed Command: ${lowerText}`);

    // More flexible command matching
    const sleepCastCommands = ['sleep cast', 'sleepcast', 'open sleep cast', 'take me to sleep cast', 'go to sleep cast'];
    const dashboardCommands = ['dashboard', 'home', 'main menu', 'go back'];
    const journalCommands = ['journal', 'sleep journal', 'open journal', 'my journal'];

    if (sleepCastCommands.some(cmd => lowerText.includes(cmd))) {
      androidLog('Sleep cast command detected - Navigating to sleep cast');
      speak("Taking you to the Sleep Cast page...");
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/app/sleep-cast');
          toast.success('Navigating to Sleep Cast');
          androidLog('Navigation executed: /app/sleep-cast');
        }
      }, 1000);
      return;
    }

    if (dashboardCommands.some(cmd => lowerText.includes(cmd))) {
      androidLog('Dashboard command detected - Navigating to dashboard');
      speak("Navigating to the dashboard...");
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/app/dashboard');
          toast.success('Navigating to Dashboard');
          androidLog('Navigation executed: /app/dashboard');
        }
      }, 1000);
      return;
    }

    if (journalCommands.some(cmd => lowerText.includes(cmd))) {
      androidLog('Journal command detected - Opening journal');
      speak("Opening your sleep journal...");
      setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/app/journal');
          toast.success('Opening Sleep Journal');
          androidLog('Navigation executed: /app/journal');
        }
      }, 1000);
      return;
    }

    // Log unrecognized commands
    androidLog(`No navigation command matched for: ${lowerText}`);

    // Mood detection and responses
    const anxiousWords = ['anxious', 'worried', 'stress', 'cant sleep'];
    const calmWords = ['relaxed', 'peaceful', 'calm', 'ready'];
    const tiredWords = ['tired', 'exhausted', 'sleepy'];

    if (anxiousWords.some(word => lowerText.includes(word))) {
      setCurrentMood('anxious');
      speak("I hear some anxiety in your voice. Let's focus on deep breathing together. Follow my lead... Breathe in... and out...");
    } else if (calmWords.some(word => lowerText.includes(word))) {
      setCurrentMood('calm');
      speak("That's great that you're feeling calm. Would you like to try a sleep cast to maintain this peaceful state?");
    } else if (tiredWords.some(word => lowerText.includes(word))) {
      setCurrentMood('tired');
      speak("I can help you drift off to sleep. Would you like me to play some soothing sounds or guide you through a relaxation exercise?");
    }
  }, [speak, navigate]);

  // Initialize voice recognition with Android logging
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        androidLog('Initializing voice recognition...');
        const success = await voiceManager.startRecording({
          onSpeechResult: handleSpeechInput,
          onSpeechStart: () => {
            if (isMountedRef.current) {
              setIsListening(true);
              androidLog('Speech recognition started - Listening...');
              toast.success('Listening...', { duration: 1000 });
            }
          },
          onSpeechEnd: () => {
            if (isMountedRef.current) {
              setIsListening(false);
              setTranscription('');
              androidLog('Speech recognition ended');
            }
          }
        }, true);

        if (success && isMountedRef.current) {
          setIsInitialized(true);
          androidLog('Voice recognition initialized successfully');
          speak("Hi, I'm your AI sleep assistant. You can ask me to play a sleep cast, check your journal, or help you relax. How are you feeling tonight?");
        }
      } catch (error) {
        console.error('Failed to initialize voice:', error);
        androidLog(`Voice initialization error: ${error.message}`);
        if (isMountedRef.current) {
          toast.error('Please enable microphone access to use the voice assistant');
        }
      }
    };

    initializeVoice();

    return () => {
      androidLog('Cleaning up voice recognition...');
      isMountedRef.current = false;
      window.speechSynthesis.cancel();
      voiceManager.stopRecording().catch(error => 
        androidLog(`Error stopping recording: ${error.message}`)
      );
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [speak, handleSpeechInput]);

  // Monitor for inactivity
  useEffect(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && Date.now() - lastInteraction > 30000) { // 30 seconds
        speak("I'm still here if you need me. Just speak when you're ready.");
      }
    }, 30000);

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [lastInteraction, speak]);

  // Status indicator component
  const StatusIndicator = () => (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 rounded-full px-4 py-2">
      <div 
        className={`h-3 w-3 rounded-full ${
          status === 'error' ? 'bg-red-500' :
          status === 'listening' ? 'bg-green-500 animate-pulse' :
          status === 'ready' ? 'bg-blue-500' :
          'bg-yellow-500'
        }`}
      />
      <span className="text-sm text-white/80">
        {status === 'error' ? 'Error - Check Microphone' :
         status === 'listening' ? 'Listening...' :
         status === 'ready' ? 'Ready - Just start talking' :
         'Initializing...'}
      </span>
      {status === 'listening' ? <Mic className="h-4 w-4 animate-pulse" /> : <MicOff className="h-4 w-4" />}
    </div>
  );

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${moodColors[currentMood]} text-white`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
    >
      {/* Status Indicator */}
      <StatusIndicator />

      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white/80 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          window.history.back();
        }}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      {/* Ambient Waves Animation */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Waves className="w-full h-full" />
      </motion.div>

      {/* Live Transcription */}
      {transcription && (
        <motion.div 
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/40 rounded-full px-6 py-2 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-white/90">{transcription}</p>
        </motion.div>
      )}

      {/* Conversation History */}
      <div className="max-w-md w-full mx-4 overflow-y-auto max-h-[60vh] space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-lg p-4 ${
                message.type === 'ai' 
                  ? 'bg-blue-500/20 text-blue-100' 
                  : 'bg-purple-500/20 text-purple-100'
              }`}
            >
              {message.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Voice Activity Visualization */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
        animate={{ 
          scale: isListening ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Volume2 className={`h-12 w-12 ${isListening ? 'text-green-400' : 'text-white/60'}`} />
        {isListening && (
          <div className="flex gap-1">
            <div className="w-1 h-8 bg-green-400 animate-sound-wave"></div>
            <div className="w-1 h-8 bg-green-400 animate-sound-wave" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-1 h-8 bg-green-400 animate-sound-wave" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-1 h-8 bg-green-400 animate-sound-wave" style={{ animationDelay: "0.3s" }}></div>
            <div className="w-1 h-8 bg-green-400 animate-sound-wave" style={{ animationDelay: "0.4s" }}></div>
          </div>
        )}
      </motion.div>

      {/* Moon Icon */}
      <motion.div 
        className="absolute bottom-10 opacity-40"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Moon className="w-12 h-12" />
      </motion.div>
    </motion.div>
  );
};

export default VoiceFirstSleepAssistant; 