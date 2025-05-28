import { toast } from '@/components/ui/sonner';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import { Porcupine } from '@picovoice/porcupine-web';

// Constants for audio management
const AUDIO_INIT_TIMEOUT = 10000; // 10 seconds
const CLEANUP_TIMEOUT = 5000; // 5 seconds
const PORCUPINE_ACCESS_KEY = 'NNHwKNHm5zHm6KZgo3fPUnUp2u8cuvAIyF1nTIXnigHVJUz92cbvyg==';

interface SpeechCallback {
  onSpeechResult: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

class VoiceManager {
  private static instance: VoiceManager;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private cleanup_timeout: NodeJS.Timeout | null = null;
  private recognition: SpeechRecognition | null = null;
  private porcupine: Porcupine | null = null;
  private speechCallback: SpeechCallback | null = null;
  private isWakeWordEnabled: boolean = false;

  private constructor() {
    // Initialize Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.setupSpeechRecognition();
    } else {
      console.error('Speech recognition not supported');
    }
  }

  public static getInstance(): VoiceManager {
    if (!VoiceManager.instance) {
      VoiceManager.instance = new VoiceManager();
    }
    return VoiceManager.instance;
  }

  private setupSpeechRecognition() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      if (event.results[last].isFinal) {
        this.speechCallback?.onSpeechResult(text);
      }
    };

    this.recognition.onstart = () => {
      this.speechCallback?.onSpeechStart?.();
    };

    this.recognition.onend = () => {
      this.speechCallback?.onSpeechEnd?.();
      // Restart recognition if we're still recording
      if (this.mediaStream) {
        this.recognition?.start();
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Please enable microphone access to use voice features');
      }
    };
  }

  public async startRecording(callback: SpeechCallback, enableWakeWord: boolean = false): Promise<boolean> {
    try {
      // Store callback
      this.speechCallback = callback;
      this.isWakeWordEnabled = enableWakeWord;

      // Cleanup any existing resources first
      await this.cleanup();

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Start speech recognition
      this.recognition?.start();

      // Initialize wake word detection if enabled
      if (enableWakeWord) {
        await this.initializeWakeWord();
      }
      
      return true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast.error('Failed to start recording. Please check your microphone permissions.');
      await this.cleanup();
      return false;
    }
  }

  private async initializeWakeWord() {
    try {
      // Initialize Porcupine wake word engine with error handling
      try {
        if (this.porcupine) {
          await WebVoiceProcessor.unsubscribe(this.porcupine);
          await this.porcupine.release();
          this.porcupine = null;
        }

        this.porcupine = await Porcupine.build(
          PORCUPINE_ACCESS_KEY,
          ['hey sleep'], // Custom wake word
          (keywordIndex: number) => {
            // Wake word detected
            toast.success('I heard you! How can I help you sleep better?');
            // Trigger a small vibration for tactile feedback if supported
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
          }
        );

        // Start processing audio for wake word detection
        await WebVoiceProcessor.subscribe(this.porcupine);
        console.log('Wake word detection initialized successfully');
      } catch (error: any) {
        if (error.message?.includes('access key')) {
          console.error('Invalid Porcupine access key:', error);
          toast.error('Wake word detection unavailable. Falling back to continuous listening.');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error initializing wake word detection:', error);
      // Continue without wake word detection
      this.isWakeWordEnabled = false;
    }
  }

  public async stopRecording(): Promise<void> {
    try {
      // Stop wake word detection if active
      if (this.porcupine) {
        await WebVoiceProcessor.unsubscribe(this.porcupine);
        await this.porcupine.release();
        this.porcupine = null;
      }

      // Stop speech recognition
      if (this.recognition) {
        this.recognition.stop();
        this.recognition.onresult = null;
        this.recognition.onstart = null;
        this.recognition.onend = null;
        this.recognition.onerror = null;
        this.recognition = null;
      }

      // Cancel any ongoing speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Reset state
      this.isWakeWordEnabled = false;
    } catch (error) {
      console.error('Error stopping recording:', error);
      // Continue with cleanup even if there are errors
    }
  }

  private async cleanup(): Promise<void> {
    return new Promise((resolve) => {
      // Clear any existing cleanup timeout
      if (this.cleanup_timeout) {
        clearTimeout(this.cleanup_timeout);
      }

      // Set a new timeout to ensure cleanup completes
      this.cleanup_timeout = setTimeout(() => {
        console.warn('Cleanup timeout reached, forcing cleanup');
        this.forceCleanup();
        resolve();
      }, CLEANUP_TIMEOUT);

      try {
        // Stop all tracks in the media stream
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => {
            track.stop();
            this.mediaStream?.removeTrack(track);
          });
          this.mediaStream = null;
        }

        // Close audio context
        if (this.audioContext) {
          this.audioContext.close().catch(console.error);
          this.audioContext = null;
        }

        // Cleanup any audio elements
        document.querySelectorAll('audio').forEach(audio => {
          try {
            audio.pause();
            audio.srcObject = null;
          } catch (e) {
            console.warn('Error cleaning up audio element:', e);
          }
        });

        // Clear the cleanup timeout since we finished normally
        if (this.cleanup_timeout) {
          clearTimeout(this.cleanup_timeout);
        }

        resolve();
      } catch (error) {
        console.error('Error during cleanup:', error);
        this.forceCleanup();
        resolve();
      }
    });
  }

  private forceCleanup(): void {
    // Force stop any remaining media tracks
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Error force stopping media tracks:', e);
      }
      this.mediaStream = null;
    }

    // Force close audio context
    if (this.audioContext) {
      try {
        this.audioContext.close().catch(console.error);
      } catch (e) {
        console.warn('Error force closing audio context:', e);
      }
      this.audioContext = null;
    }

    // Stop speech recognition
    try {
      this.recognition?.stop();
    } catch (e) {
      console.warn('Error stopping speech recognition:', e);
    }

    // Clear any timeouts
    if (this.cleanup_timeout) {
      clearTimeout(this.cleanup_timeout);
      this.cleanup_timeout = null;
    }
  }
}

export const voiceManager = VoiceManager.getInstance(); 