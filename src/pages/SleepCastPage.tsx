
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import SleepCastCard from '@/components/sleep/SleepCastCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Data for sleep casts
const sleepCasts = [
  { 
    id: 'nature', 
    title: 'Nature Sounds', 
    description: 'Calming forest and river sounds',
    duration: '45 min',
    category: 'Nature'
  },
  { 
    id: 'ocean', 
    title: 'Ocean Waves', 
    description: 'Peaceful waves and ocean ambience',
    duration: '60 min',
    category: 'Nature'
  },
  { 
    id: 'tamil', 
    title: 'Tamil Folklore', 
    description: 'Traditional stories from Tamil Nadu',
    duration: '30 min',
    category: 'Stories'
  },
  { 
    id: 'rain', 
    title: 'Rainy Night', 
    description: 'Gentle rain sounds with distant thunder',
    duration: '50 min',
    category: 'Nature'
  },
  { 
    id: 'meadow', 
    title: 'Mountain Meadow', 
    description: 'Birds chirping and gentle breeze',
    duration: '40 min',
    category: 'Nature'
  },
  { 
    id: 'meditation', 
    title: 'Guided Meditation', 
    description: 'Deep relaxation for mind and body',
    duration: '20 min',
    category: 'Meditation'
  },
];

const SleepCastPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedCast, setSelectedCast] = useState(sleepCasts[0]);
  const [recommendation, setRecommendation] = useState('Ocean Waves'); // Simulating a recommendation
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setRecommendation('Ocean Waves');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast(`Playing ${selectedCast.title}`);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleCastSelect = (cast: any) => {
    setSelectedCast(cast);
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 500);
      toast(`Changing to ${cast.title}`);
    }
  };

  return (
    <PageContainer className="relative overflow-hidden">
      {/* Starry sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] to-[#6B21A8] z-[-1]">
        <div className="absolute inset-0 opacity-30" 
             style={{background: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 5px)', 
                    backgroundSize: '50px 50px'}}>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/app/dashboard')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-azleep-text">Sleep Cast</h1>
      </div>
      
      {/* Recommendation section */}
      <div className="mb-6 animate-fade-in">
        <div className="rounded-lg bg-white/10 backdrop-blur-sm p-3 flex items-center">
          <div className="bg-azleep-accent/20 rounded-full p-1 mr-2">
            <span className="text-azleep-accent text-sm">✨</span>
          </div>
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Recommended:</span>{' '}
            <span className="text-azleep-text">{recommendation}</span>
          </p>
        </div>
      </div>

      {/* Main player section */}
      <div className="flex flex-col items-center justify-center h-[40vh] md:h-[50vh] animate-fade-in">
        <div className={`w-60 h-60 mb-8 md:w-72 md:h-72 ${isPlaying ? 'shadow-glow' : ''}`}
             style={{
               boxShadow: isPlaying ? '0 0 20px rgba(251, 191, 36, 0.4)' : 'none',
               transition: 'box-shadow 0.3s ease'
             }}>
          <AspectRatio ratio={1/1} className="relative">
            <div className={`absolute inset-0 rounded-full sleep-card flex flex-col items-center justify-center ${isPlaying ? 'pulse-ring' : ''}`}>
              <div className="text-center px-4 mb-4">
                <p className="text-lg font-medium text-azleep-text mb-2">
                  {selectedCast.title}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCast.description}
                </p>
                {/* Audio waveform visualization */}
                {isPlaying && (
                  <div className="flex items-end justify-center h-12 gap-1 mb-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="bg-[#FBBF24] w-2 rounded-full"
                        style={{
                          height: `${20 + Math.sin((Date.now() / 500) + i) * 15}px`,
                          animation: 'pulse-audio 1.5s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="outline"
                size="icon" 
                className="h-14 w-14 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-white border-none"
                onClick={handlePlayPause}
              >
                {isPlaying ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6 ml-1" />
                }
              </Button>
            </div>
          </AspectRatio>
        </div>
        
        <div className="flex items-center w-full max-w-xs md:max-w-sm mb-8">
          <Volume2 className="mr-2 h-5 w-5 text-muted-foreground" />
          <Slider 
            defaultValue={[volume]} 
            max={100} 
            step={1} 
            className="w-full"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      
      {/* Sleep cast list section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-azleep-text mb-4">More Sleep Casts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {sleepCasts.map((cast) => (
            <div key={cast.id} className="animate-fade-in" style={{ animationDelay: `${sleepCasts.indexOf(cast) * 0.1}s` }}>
              <SleepCastCard 
                {...cast}
                onPlay={() => handleCastSelect(cast)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view: featured casts carousel */}
      {isMobile && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-azleep-text mb-4">Featured Sleep Casts</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {sleepCasts.slice(0, 3).map((cast) => (
                <CarouselItem key={cast.id} className="md:basis-1/2 lg:basis-1/3">
                  <SleepCastCard 
                    {...cast}
                    onPlay={() => handleCastSelect(cast)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </PageContainer>
  );
};

export default SleepCastPage;
