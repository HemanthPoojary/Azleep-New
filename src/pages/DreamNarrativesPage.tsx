import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import { Widget } from '@/components/ui/widget';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { Moon, Mic, StopCircle, Play, Pause, MessageSquare, Stars, Cloud, Sparkles, CloudMoon, Cloudy, Brain, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDreamStorage } from '@/hooks/useDreamStorage';
import { PostgrestResponse } from '@supabase/supabase-js';

interface DreamNarrative {
  id: string;
  title?: string;
  narrative_text: string;
  audio_url?: string;
  user_id: string;
  created_at: string;
}

interface AudioPlayerProps {
  url: string;
  compact?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'min-w-[200px]'}`}>
      <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
      <Button
        variant="ghost"
        size={compact ? "icon" : "default"}
        className={`${
          compact ? 'h-8 w-8' : 'px-4 py-2'
        } rounded-full ${
          isPlaying ? 'bg-azleep-accent text-white' : 'text-white hover:text-azleep-accent'
        }`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
        ) : (
          <Play className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
        )}
        {!compact && <span className="ml-2">{isPlaying ? 'Pause' : 'Play'} Audio</span>}
      </Button>
      {!compact && (
        <div className="text-sm text-gray-400">
          {audioRef.current?.duration ? 
            `${Math.floor(audioRef.current.duration / 60)}:${Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0')}` 
            : '--:--'
          }
        </div>
      )}
    </div>
  );
};

const WEBHOOK_URL = 'https://hemanthk.app.n8n.cloud/webhook/01561999-49ad-4c19-8fc2-aced83d8f9c7/chat';

const FloatingElement = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.3, y: 0 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      delay,
    }}
  >
    {children}
  </motion.div>
);

const FullNarrativeDialog = ({ narrative, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a2e] to-[#1a1a35] border-white/5 text-white max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        {/* Fixed Header */}
        <motion.div
          className="relative p-6 border-b border-white/5 backdrop-blur-md bg-white/5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <motion.h2 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {narrative.title || 'Untitled Dream'}
              </motion.h2>
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {format(new Date(narrative.created_at), 'MMMM d, yyyy')}
              </motion.p>
            </div>
            
            {narrative.audio_url && (
              <motion.div
                className="bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AudioPlayer url={narrative.audio_url} compact={false} />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <motion.div 
          className="relative p-6 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-azleep-primary/5 via-transparent to-azleep-accent/5 opacity-30 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            <motion.div 
              className="prose prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
                  {narrative.narrative_text}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const DreamCard = ({ narrative, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          perspective: '1000px'
        }}
      >
        <motion.div
          className="relative cursor-pointer"
          animate={{
            rotateX: isHovered ? '2deg' : '0deg',
            rotateY: isHovered ? '2deg' : '0deg',
            z: isHovered ? 20 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setIsDialogOpen(true)}
        >
          <Widget 
            className="relative overflow-hidden backdrop-blur-xl border border-white/5"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9), rgba(30, 30, 50, 0.8))',
              boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            {/* 3D lighting effect */}
            <motion.div
              className="absolute inset-0 opacity-0"
              animate={{
                opacity: isHovered ? 0.2 : 0,
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)'
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Content */}
            <div className="grid grid-cols-12 gap-4 items-center relative z-10">
              <div className="col-span-3">
                <motion.h3 
                  className="text-white font-medium line-clamp-1"
                  animate={{ 
                    scale: isHovered ? 1.02 : 1,
                    color: isHovered ? 'rgb(var(--azleep-accent))' : 'white'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {narrative.title || 'Untitled Dream'}
                </motion.h3>
              </div>
              <div className="col-span-6">
                <motion.p 
                  className="text-gray-300 line-clamp-2"
                  animate={{ y: isHovered ? 0 : 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {narrative.narrative_text}
                </motion.p>
              </div>
              <div className="col-span-3 text-right">
                <motion.div
                  className="text-gray-400 text-sm"
                  animate={{ opacity: isHovered ? 1 : 0.7 }}
                >
                  {format(new Date(narrative.created_at), 'MMM d, yyyy')}
                </motion.div>
                {narrative.audio_url && (
                  <div className="mt-2">
                    <AudioPlayer url={narrative.audio_url} compact />
                  </div>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-azleep-accent/5 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-azleep-primary/5 rounded-full blur-2xl transform -translate-x-12 translate-y-12" />
            </motion.div>

            {/* Add a subtle "Click to read more" indicator */}
            <motion.div
              className="absolute right-4 bottom-4 flex items-center gap-1 text-xs text-white font-medium bg-azleep-accent/20 px-2 py-1 rounded-full backdrop-blur-sm"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>Read more</span>
              <ChevronRight className="h-3 w-3" />
            </motion.div>
          </Widget>
        </motion.div>
      </motion.div>

      <FullNarrativeDialog
        narrative={narrative}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

const DreamLogo = () => {
  return (
    <motion.div 
      className="relative w-12 h-12"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Outer ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-azleep-accent/30"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Inner elements */}
      <motion.div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }} // Counter-rotate to stay upright
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <CloudMoon className="h-6 w-6 text-azleep-accent" />
        </motion.div>
      </motion.div>
      
      {/* Floating clouds */}
      <motion.div 
        className="absolute top-0 right-0"
        animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Cloudy className="h-4 w-4 text-azleep-primary/50" />
      </motion.div>
      
      {/* Sparkle effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${30 + i * 20}%`,
            left: `${30 + i * 20}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        >
          <Stars className="h-2 w-2 text-azleep-accent" />
        </motion.div>
      ))}
    </motion.div>
  );
};

const SleepNudge = () => {
  const [currentNudge, setCurrentNudge] = useState(0);
  
  const nudges = [
    {
      icon: <Brain className="h-5 w-5" />,
      text: "Writing dreams improves memory retention by 30%",
      color: "text-azleep-accent"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      text: "Regular dream journaling reduces stress levels",
      color: "text-pink-400"
    },
    {
      icon: <Stars className="h-5 w-5" />,
      text: "95% of dreams are forgotten within 5 minutes of waking",
      color: "text-yellow-400"
    },
    {
      icon: <Moon className="h-5 w-5" />,
      text: "Record your dreams to unlock your subconscious",
      color: "text-purple-400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNudge((prev) => (prev + 1) % nudges.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      key={currentNudge}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-lg rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <motion.div 
        className={`${nudges[currentNudge].color}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {nudges[currentNudge].icon}
      </motion.div>
      <motion.span 
        className="text-sm text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {nudges[currentNudge].text}
      </motion.span>
    </motion.div>
  );
};

const MotionButton = motion(Button);

const DreamNarrativesPage = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { uploadFile } = useDreamStorage();
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [narrativeText, setNarrativeText] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Log the raw data from Supabase for debugging
  const logNarrativeData = (data: any) => {
    console.log('Raw narrative data:', data);
    return data;
  };

  const { data: narratives, isLoading: isLoadingNarratives, error } = useQuery({
    queryKey: ['dreamNarratives'],
    queryFn: async () => {
      const response = await supabase
        .from('dream_narratives')
        .select('id, title, narrative_text, audio_url, user_id, created_at')
        .order('created_at', { ascending: false });

      if (response.error) {
        console.error('Supabase query error:', response.error);
        return [];
      }
      
      // Log the data for debugging
      logNarrativeData(response.data);
      
      // Ensure we always return an array
      return (response.data || []) as unknown as DreamNarrative[];
    },
  });

  const createNarrativeMutation = useMutation({
    mutationFn: async ({ title, narrativeText, audioUrl }: { title: string; narrativeText: string; audioUrl?: string }) => {
      const { data, error } = await supabase
        .from('dream_narratives')
        .insert([
          {
            title,
            narrative_text: narrativeText,
            audio_url: audioUrl,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamNarratives'] });
      toast.success('Dream narrative saved successfully');
      setIsDialogOpen(false);
      setTitle('');
      setNarrativeText('');
      setAudioBlob(null);
    },
    onError: (error) => {
      toast.error('Failed to save dream narrative');
      console.error('Error saving dream narrative:', error);
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    try {
      let audioUrl: string | undefined;
      if (audioBlob) {
        const file = new File([audioBlob], `${Date.now()}-dream.webm`, { type: 'audio/webm' });
        const uploadedFile = await uploadFile(file);
        audioUrl = uploadedFile.publicUrl;
      }

      await createNarrativeMutation.mutateAsync({
        title: title.trim(),
        narrativeText: narrativeText.trim(),
        audioUrl,
      });
    } catch (error) {
      console.error('Error saving dream narrative:', error);
      toast.error('Failed to save dream narrative');
    }
  };

  const handleWebhookChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: (await supabase.auth.getUser()).data.user?.id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to chat');
      }

      const responseData = await response.json();
      console.log('Webhook response:', responseData);

      // Save the narrative from webhook response
      if (responseData.narrative) {
        await createNarrativeMutation.mutateAsync({
          title: responseData.title || 'Untitled Dream', // Provide default title if not present
          narrativeText: responseData.narrative,
          audioUrl: responseData.audioUrl,
        });
        toast.success('Dream narrative saved successfully');
      } else {
        toast.error('Invalid response from chat');
      }
    } catch (error) {
      console.error('Error handling dream narrative:', error);
      toast.error('Failed to save dream narrative');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    toast.error('Failed to load dream narratives');
  }

  return (
    <PageContainer className="bg-gradient-sleep overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 pb-8 animate-fade-in relative">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-azleep-primary/20 via-transparent to-azleep-accent/10 opacity-30" />
        </div>

        {/* Header */}
        <Widget className="mb-6 relative overflow-hidden backdrop-blur-xl border border-white/5">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.9), rgba(30, 30, 50, 0.8))',
            }}
          />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="rounded-full bg-azleep-primary/20 p-3 flex items-center gap-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DreamLogo />
                  <Moon className="h-6 w-6 text-azleep-primary" />
                </motion.div>
                <div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Dream Narratives</h1>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="hidden sm:flex items-center gap-2"
                    >
                      <div className="h-6 w-[1px] bg-azleep-accent/30" />
                      <span className="text-azleep-accent/70 text-sm font-medium">Urban Whispers</span>
                    </motion.div>
                  </motion.div>
                  <motion.p 
                    className="text-gray-300"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Record and explore your dream stories
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MotionButton
                  className="bg-azleep-accent hover:bg-azleep-accent/90 text-white transition-all duration-300"
                  size={isMobile ? "sm" : "default"}
                  onClick={handleWebhookChat}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {isLoading ? 'Connecting...' : (isMobile ? 'New Dream' : 'New Dream Narrative')}
                </MotionButton>
              </motion.div>
            </div>
          </div>
        </Widget>

        {/* Content */}
        <div className="space-y-4">
          {/* Column Headers */}
          <motion.div 
            className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="col-span-3">Title</div>
            <div className="col-span-6">Narrative</div>
            <div className="col-span-3 text-right">Details</div>
          </motion.div>

          {isLoadingNarratives ? (
            // Loading state with enhanced animations
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Widget className="relative overflow-hidden backdrop-blur-xl border border-white/5">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div className="grid grid-cols-12 gap-4 items-center relative">
                      <div className="col-span-3">
                        <Skeleton className="h-6 w-3/4 bg-white/5" />
                      </div>
                      <div className="col-span-6">
                        <Skeleton className="h-6 w-3/4 bg-white/5" />
                      </div>
                      <div className="col-span-3">
                        <Skeleton className="h-6 w-full bg-white/5" />
                      </div>
                    </div>
                  </Widget>
                </motion.div>
              ))}
            </>
          ) : narratives && narratives.length > 0 ? (
            <AnimatePresence>
              {narratives.map((narrative, index) => (
                <DreamCard key={narrative.id} narrative={narrative} index={index} />
              ))}
            </AnimatePresence>
          ) : (
            <Widget className="backdrop-blur-xl border border-white/5">
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Moon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                </motion.div>
                <motion.p 
                  className="text-lg text-white mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  No dream narratives found
                </motion.p>
                <motion.p 
                  className="text-gray-400 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Start recording your dream stories to build your collection
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <MotionButton 
                    className="bg-azleep-accent hover:bg-azleep-accent/90 transition-all duration-300"
                    onClick={handleWebhookChat}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isLoading ? 'Connecting...' : 'Start Your First Dream Narrative'}
                  </MotionButton>
                </motion.div>
              </motion.div>
            </Widget>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Dream Narrative</DialogTitle>
            <DialogDescription>
              Write down your dream while it's still fresh in your memory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your dream"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="narrative">Your Dream</Label>
              <Textarea
                id="narrative"
                value={narrativeText}
                onChange={(e) => setNarrativeText(e.target.value)}
                placeholder="Describe your dream..."
                rows={6}
              />
            </div>
            {audioBlob && (
              <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-gray-300">Audio recording ready</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setAudioBlob(null)}
                >
                  Remove
                </Button>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()}>
                Save Dream
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default DreamNarrativesPage; 