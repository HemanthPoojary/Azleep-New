import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { voiceManager } from '@/lib/voice-manager';
import ElevenLabsVoiceDialog from '@/components/sleep/ElevenLabsVoiceDialog';

interface VoiceButtonProps {
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
}

const VoiceButton = ({ onStart, onStop, className }: VoiceButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (isRecording) {
        voiceManager.stopRecording().catch(console.error);
      }
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    setShowVoiceDialog(true);
    try {
      if (!isMountedRef.current) return;

      if (isRecording) {
        await voiceManager.stopRecording();
        if (isMountedRef.current) {
          setIsRecording(false);
          onStop?.();
        }
      } else {
        const success = await voiceManager.startRecording();
        if (success && isMountedRef.current) {
          setIsRecording(true);
          onStart?.();
        }
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      if (isMountedRef.current) {
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {isRecording && (
        <>
          <div className="absolute h-16 w-16 rounded-full bg-azleep-primary/30 pulse-ring"></div>
          <div className="absolute h-24 w-24 rounded-full bg-azleep-primary/20 pulse-ring" style={{ animationDelay: "0.3s" }}></div>
        </>
      )}
      <Button
        onClick={toggleRecording}
        variant={isRecording ? "destructive" : "default"}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300", 
          isRecording 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-azleep-primary hover:bg-azleep-primary/90",
          className
        )}
      >
        <Mic className={cn("h-6 w-6", isRecording ? "animate-pulse" : "")} />
      </Button>
      <ElevenLabsVoiceDialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog} />
    </div>
  );
};

export default VoiceButton;
