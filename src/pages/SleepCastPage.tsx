
import React, { useState } from 'react';
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

const sleepCastThemes = [
  { id: 'nature', name: 'Nature', description: 'Calming forest and river sounds' },
  { id: 'tamil', name: 'Tamil Folklore', description: 'Traditional stories from Tamil Nadu' },
  { id: 'ocean', name: 'Ocean', description: 'Peaceful waves and ocean ambience' },
];

const SleepCastPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedTheme, setSelectedTheme] = useState('nature');
  const isMobile = useIsMobile();
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast(`Playing ${sleepCastThemes.find(t => t.id === selectedTheme)?.name} sleep cast`);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 500);
      toast(`Changing to ${sleepCastThemes.find(t => t.id === value)?.name} sleep cast`);
    }
  };

  return (
    <PageContainer className="relative overflow-hidden">
      {/* Starry sky background */}
      <div className="absolute inset-0 bg-azleep-dark z-[-1]">
        <div className="absolute inset-0 opacity-30" 
             style={{background: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 5px)', 
                    backgroundSize: '50px 50px'}}>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-azleep-text">Sleep Cast</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[60vh] md:h-[70vh] animate-fade-in">
        <div className="w-full max-w-md mb-8">
          <Select value={selectedTheme} onValueChange={handleThemeChange}>
            <SelectTrigger className="sleep-card w-full">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent className="bg-azleep-dark border-white/10">
              {sleepCastThemes.map(theme => (
                <SelectItem key={theme.id} value={theme.id} className="focus:bg-azleep-accent/20">
                  {theme.name} - {theme.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-60 h-60 mb-10 md:w-72 md:h-72">
          <AspectRatio ratio={1/1} className="relative">
            <div className={`absolute inset-0 rounded-full sleep-card flex items-center justify-center ${isPlaying ? 'pulse-ring' : ''}`}>
              <div className="text-center px-4">
                <p className="text-lg font-medium text-azleep-text mb-2">
                  {sleepCastThemes.find(t => t.id === selectedTheme)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {sleepCastThemes.find(t => t.id === selectedTheme)?.description}
                </p>
              </div>
            </div>
          </AspectRatio>
        </div>
        
        <div className="flex flex-col items-center w-full max-w-xs md:max-w-sm">
          <Button 
            variant="outline"
            size="icon" 
            className="h-16 w-16 rounded-full mb-8 bg-azleep-accent hover:bg-azleep-accent/90 text-white"
            onClick={handlePlayPause}
          >
            {isPlaying ? 
              <Pause className="h-8 w-8" /> : 
              <Play className="h-8 w-8 ml-1" />
            }
          </Button>
          
          <div className="flex items-center w-full mb-8">
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
      </div>
    </PageContainer>
  );
};

export default SleepCastPage;
