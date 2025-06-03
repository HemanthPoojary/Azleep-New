import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Volume2, VolumeX, Mic, Settings, Bot, Zap, Play, Square } from 'lucide-react';
import { ElevenLabsAgent } from './ElevenLabsAgent';
import vapi from '@/config/vapi';

const SILENCE_TIMEOUT = 5000; // 5 seconds of silence before stopping

type AIProvider = 'vapi' | 'elevenlabs'

interface EnhancedSleepGenieDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const EnhancedSleepGenieDialog: React.FC<EnhancedSleepGenieDialogProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('elevenlabs')
  const [conversation, setConversation] = useState<{sender: string, text: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [vapiManuallyStarted, setVapiManuallyStarted] = useState(false);
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

  // Cleanup when dialog closes or component unmounts
  useEffect(() => {
    if (!isOpen) {
      cleanup();
      hasInitializedRef.current = false;
      setVapiManuallyStarted(false);
    }
    return () => {
      cleanup();
      hasInitializedRef.current = false;
      setVapiManuallyStarted(false);
    };
  }, [isOpen]);

  // Voice announcement function
  const announceProvider = (provider: AIProvider, action: string = 'activated') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        provider === 'vapi' 
          ? `VAPI voice assistant ${action}` 
          : `ElevenLabs AI agent ${action}`
      );
      utterance.rate = 0.8;
      utterance.pitch = provider === 'vapi' ? 1.2 : 0.8; // Different pitch for each
      speechSynthesis.speak(utterance);
    }
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (callRef.current && isListening) {
        handleVoiceToggle();
        toast("Conversation ended due to inactivity");
      }
    }, SILENCE_TIMEOUT);
  };

  const cleanup = async () => {
    try {
      if (callRef.current) {
        await callRef.current.stop();
        callRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping call:", error);
    }

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    setIsListening(false);
    setIsThinking(false);
    setIsSpeaking(false);
    setCurrentTranscription('');
  };

  const initializeVapiCall = async () => {
    try {
      announceProvider('vapi', 'starting');
      
      const call = await vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
      
      if (!call) {
        console.error("Failed to initialize Vapi call");
        toast.error("❌ VAPI: Failed to start voice chat. Please try again.");
        return;
      }

      const vapiCall = call as any;
      callRef.current = vapiCall;
      setVapiManuallyStarted(true);

      if (vapiCall && typeof vapiCall.on === 'function') {
        vapiCall.on('speech-start', () => {
          setIsSpeaking(true);
          announceProvider('vapi', 'is speaking');
        });

        vapiCall.on('speech-end', () => {
          setIsSpeaking(false);
        });

        vapiCall.on('call-start', () => {
          setIsListening(true);
          toast("🟡 VAPI Voice Assistant is NOW LISTENING! 🎤", {
            description: "You are talking to VAPI AI technology",
            duration: 3000
          });
          resetSilenceTimeout();
        });

        vapiCall.on('call-end', () => {
          setIsListening(false);
          setCurrentTranscription('');
          setVapiManuallyStarted(false);
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        });

        vapiCall.on('message', (message: any) => {
          if (message.type === 'transcript') {
            setCurrentTranscription(message.content);
          } else if (message.role === "assistant") {
            setConversation(prev => [...prev, { sender: 'ai', text: message.content }]);
          } else if (message.role === "user") {
            setConversation(prev => [...prev, { sender: 'user', text: message.content }]);
            setCurrentTranscription('');
            resetSilenceTimeout();
          }
        });
      }
    } catch (error) {
      console.error("Error initializing Vapi call:", error);
      toast.error("❌ VAPI: Failed to connect to Sleep Genie. Please try again.");
    }
  };

  const handleVapiStart = async () => {
    if (!vapiManuallyStarted) {
      await initializeVapiCall();
    }
  };

  const handleVoiceToggle = async () => {
    if (currentProvider !== 'vapi') return;

    if (isListening && callRef.current) {
      try {
        await callRef.current.stop();
        setIsListening(false);
        setVapiManuallyStarted(false);
        announceProvider('vapi', 'stopped');
        toast("🟡 VAPI conversation ended");
      } catch (error) {
        console.error("Error stopping call:", error);
        toast.error("Error ending conversation");
      }
    } else {
      await handleVapiStart();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (callRef.current && typeof callRef.current.setMuted === 'function') {
      callRef.current.setMuted(!isMuted);
    }
  };

  const switchProvider = (provider: AIProvider) => {
    if (currentProvider === provider) return;
    
    // Cleanup current provider
    if (currentProvider === 'vapi') {
      cleanup();
      setVapiManuallyStarted(false);
    }
    
    setCurrentProvider(provider);
    setConversation([]);
    
    // Announce provider switch
    const providerName = provider === 'vapi' ? 'VAPI' : 'ElevenLabs';
    announceProvider(provider, 'selected');
    toast(`🔄 Switched to ${providerName} AI`, {
      description: `Now using ${providerName} for voice conversation`,
      duration: 3000
    });
  };

  const handleElevenLabsStart = () => {
    setIsListening(true);
    announceProvider('elevenlabs', 'activated');
    toast("🔵 ElevenLabs AI Agent is NOW ACTIVE! 🤖", {
      description: "You are talking to ElevenLabs conversational AI",
      duration: 3000
    });
  };

  const handleElevenLabsEnd = () => {
    setIsListening(false);
    announceProvider('elevenlabs', 'stopped');
    toast("🔵 ElevenLabs AI Agent stopped");
  };

  // Get provider-specific styling with more dramatic differences
  const getProviderStyles = () => {
    if (currentProvider === 'elevenlabs') {
      return {
        headerBg: isListening 
          ? 'from-blue-500/30 to-purple-500/30 animate-pulse' 
          : 'from-blue-500/10 to-purple-500/10',
        accentColor: 'bg-blue-500',
        borderColor: 'border-blue-500/20',
        glowEffect: isListening ? 'shadow-2xl shadow-blue-500/50' : '',
        bgPattern: isListening ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50' : ''
      }
    } else {
      return {
        headerBg: isListening 
          ? 'from-yellow-500/30 to-orange-500/30 animate-pulse' 
          : 'from-yellow-500/10 to-orange-500/10',
        accentColor: 'bg-yellow-500',
        borderColor: 'border-yellow-500/20',
        glowEffect: isListening ? 'shadow-2xl shadow-yellow-500/50' : '',
        bgPattern: isListening ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50' : ''
      }
    }
  };

  const styles = getProviderStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full max-w-2xl h-[90vh] flex flex-col transition-all duration-500 ${styles.bgPattern} ${styles.glowEffect} border-2 ${
        isListening 
          ? currentProvider === 'elevenlabs' ? 'border-blue-500' : 'border-yellow-500'
          : 'border-white/10'
      }`}>
        
        {/* MASSIVE Provider Indicator Banner */}
        {isListening && (
          <div className={`absolute top-0 left-0 right-0 z-10 p-2 text-center font-bold text-lg animate-pulse ${
            currentProvider === 'elevenlabs' 
              ? 'bg-blue-600 text-white' 
              : 'bg-yellow-600 text-black'
          }`}>
            🎤 {currentProvider === 'elevenlabs' ? '🔵 ELEVENLABS AI SPEAKING' : '🟡 VAPI AI SPEAKING'} 🎤
          </div>
        )}

        {/* Enhanced Header with Provider Indication */}
        <DialogHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 p-4 rounded-lg bg-gradient-to-r ${styles.headerBg} ${styles.borderColor} border-2 ${isListening ? 'mt-12' : ''} transition-all duration-300`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${styles.accentColor} ${isListening ? 'animate-bounce' : ''}`} />
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                Sleep Genie AI
                {currentProvider === 'elevenlabs' ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-base px-3 py-1">
                    <Bot className="h-4 w-4 mr-1" />
                    🔵 ELEVENLABS
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-base px-3 py-1">
                    <Zap className="h-4 w-4 mr-1" />
                    🟡 VAPI
                  </Badge>
                )}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {currentProvider === 'elevenlabs' 
                  ? '🔵 Powered by ElevenLabs conversational AI'
                  : '🟡 Powered by VAPI voice technology'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={currentProvider === 'vapi' ? "default" : "outline"}
              onClick={() => switchProvider('vapi')}
              className={`h-10 px-4 font-bold ${currentProvider === 'vapi' ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg' : 'hover:bg-yellow-50'}`}
            >
              <Zap className="h-4 w-4 mr-1" />
              🟡 VAPI
            </Button>
            <Button
              size="sm"
              variant={currentProvider === 'elevenlabs' ? "default" : "outline"}
              onClick={() => switchProvider('elevenlabs')}
              className={`h-10 px-4 font-bold ${currentProvider === 'elevenlabs' ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-50'}`}
            >
              <Bot className="h-4 w-4 mr-1" />
              🔵 ELEVENLABS
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {currentProvider === 'elevenlabs' ? (
            <ElevenLabsAgent
              agentId="agent_01jwq3qhggez2r9tafedrvvw0c"
              onConversationStart={handleElevenLabsStart}
              onConversationEnd={handleElevenLabsEnd}
              className="flex-1"
            />
          ) : (
            <>
              {/* VAPI Chat Interface */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30 rounded-lg"
              >
                {!vapiManuallyStarted && (
                  <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10">
                    <div className="flex items-center justify-center mb-6">
                      <Zap className="h-12 w-12 text-yellow-500 mr-3" />
                      <span className="text-2xl font-bold text-yellow-600">🟡 VAPI Voice Assistant</span>
                    </div>
                    <div className="mb-6">
                      <Play className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                      <p className="text-xl font-semibold mb-2">Ready to Start VAPI</p>
                      <p className="text-sm text-muted-foreground">Click the play button below to activate VAPI voice chat</p>
                    </div>
                    <Button 
                      onClick={handleVapiStart}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      🟡 START VAPI NOW
                    </Button>
                  </div>
                )}

                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg border-2 ${
                        message.sender === 'user'
                          ? 'bg-yellow-500 text-black ml-4 border-yellow-600 font-semibold'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-foreground mr-4 border-yellow-300'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.sender === 'ai' && (
                        <div className="flex items-center mt-2 bg-yellow-200 dark:bg-yellow-800 rounded px-2 py-1">
                          <Zap className="h-3 w-3 text-yellow-600 mr-1" />
                          <span className="text-xs font-bold text-yellow-700">🟡 VAPI RESPONSE</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {currentTranscription && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-4 rounded-lg bg-yellow-500/70 text-black ml-4 border-2 border-yellow-600">
                      <p className="text-sm font-semibold">
                        🟡 VAPI HEARING: {currentTranscription}
                        <span className="inline-block w-2 h-4 bg-black/70 ml-1 animate-pulse"></span>
                      </p>
                    </div>
                  </div>
                )}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mr-4 border-2 border-yellow-300">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm font-bold text-yellow-700">🟡 VAPI Sleep Genie is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* VAPI Controls */}
              {vapiManuallyStarted && (
                <div className="flex items-center justify-center p-6 border-t-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleMute}
                      className="h-12 w-12 p-0 border-2 border-yellow-500"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5 text-yellow-600" /> : <Volume2 className="h-5 w-5 text-yellow-600" />}
                    </Button>

                    <Button
                      onClick={handleVoiceToggle}
                      className={`h-16 w-16 rounded-full transition-all font-bold ${
                        isListening 
                          ? 'bg-yellow-500 animate-bounce shadow-2xl shadow-yellow-500/70 border-4 border-yellow-600' 
                          : 'bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-600'
                      }`}
                    >
                      {isListening ? (
                        <Square className="h-7 w-7 text-black" />
                      ) : (
                        <Mic className="h-7 w-7 text-black" />
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-base font-bold text-yellow-700">
                        {isListening 
                          ? "🟡 VAPI LISTENING..."
                        : isSpeaking
                        ? "🟡 VAPI SPEAKING..."
                        : "🟡 TAP TO TALK WITH VAPI"}
                      </p>
                      <Badge variant="outline" className="text-sm mt-2 border-2 border-yellow-500 text-yellow-700 px-3 py-1">
                        <Zap className="h-3 w-3 mr-1" />
                        🟡 VAPI ACTIVE
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Status indicator */}
        <div className="flex items-center justify-center p-3">
          <Badge variant="outline" className={`text-sm px-4 py-2 border-2 font-bold ${
            currentProvider === 'elevenlabs' 
              ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950' 
              : 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
          }`}>
            {currentProvider === 'elevenlabs' ? (
              <>
                <Bot className="h-3 w-3 mr-1" />
                🔵 ELEVENLABS AI
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 mr-1" />
                🟡 VAPI
              </>
            )} • 
            {isListening ? ' 🎤 ACTIVE & LISTENING' : ' ⏸️ READY TO START'}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSleepGenieDialog; 