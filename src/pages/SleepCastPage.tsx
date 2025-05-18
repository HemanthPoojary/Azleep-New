
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, ArrowLeft, Moon, Star, CloudMoon, Waves, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import SleepCastCard from '@/components/sleep/SleepCastCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Data for sleep casts
const sleepCasts = [{
  id: 'nature',
  title: 'Nature Sounds',
  description: 'Calming forest and river sounds',
  duration: '45 min',
  category: 'Nature'
}, {
  id: 'ocean',
  title: 'Ocean Waves',
  description: 'Peaceful waves and ocean ambience',
  duration: '60 min',
  category: 'Nature'
}, {
  id: 'tamil',
  title: 'Tamil Folklore',
  description: 'Traditional stories from Tamil Nadu',
  duration: '30 min',
  category: 'Stories'
}, {
  id: 'rain',
  title: 'Rainy Night',
  description: 'Gentle rain sounds with distant thunder',
  duration: '50 min',
  category: 'Nature'
}, {
  id: 'meadow',
  title: 'Mountain Meadow',
  description: 'Birds chirping and gentle breeze',
  duration: '40 min',
  category: 'Nature'
}, {
  id: 'meditation',
  title: 'Guided Meditation',
  description: 'Deep relaxation for mind and body',
  duration: '20 min',
  category: 'Meditation'
}];

const SleepCastPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedCast, setSelectedCast] = useState(sleepCasts[0]);
  const [recommendation, setRecommendation] = useState('Ocean Waves'); // Simulating a recommendation
  const [activeCategory, setActiveCategory] = useState('All');
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

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };

  // Filter casts based on active category
  const filteredCasts = activeCategory === 'All' 
    ? sleepCasts 
    : sleepCasts.filter(cast => cast.category === activeCategory);

  return (
    <PageContainer className="relative overflow-hidden p-0">
      {/* Enhanced starry sky background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] to-[#6B21A8] z-[-1]">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 5px)',
          backgroundSize: '50px 50px'
        }}>
        </div>
        
        {/* Floating decorative elements */}
        <div className="hidden md:block absolute top-[15%] left-[5%] text-white/20 animate-float" style={{ animationDelay: '0.2s' }}>
          <CloudMoon size={64} />
        </div>
        <div className="hidden md:block absolute top-[60%] left-[8%] text-white/20 animate-float" style={{ animationDelay: '1.5s' }}>
          <Moon size={36} />
        </div>
        <div className="hidden md:block absolute top-[25%] right-[7%] text-white/20 animate-float" style={{ animationDelay: '0.7s' }}>
          <Star size={48} />
        </div>
        <div className="hidden md:block absolute top-[75%] right-[10%] text-white/20 animate-float" style={{ animationDelay: '1s' }}>
          <Waves size={40} />
        </div>
        <div className="hidden md:block absolute top-[40%] right-[25%] text-white/10 animate-float" style={{ animationDelay: '0.5s' }}>
          <Snowflake size={32} />
        </div>

        {/* Mobile floating elements (fewer to avoid overcrowding) */}
        <div className="md:hidden absolute top-[10%] left-[10%] text-white/20 animate-float" style={{ animationDelay: '0.2s' }}>
          <Moon size={24} />
        </div>
        <div className="md:hidden absolute top-[70%] right-[8%] text-white/20 animate-float" style={{ animationDelay: '0.8s' }}>
          <Star size={20} />
        </div>
      </div>

      <div className="w-full mx-auto">
        <div className="px-4 py-4 mb-2 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-azleep-text">Sleep Cast</h1>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start gap-8 w-full px-2 sm:px-4">
          {/* Left column for player on larger screens */}
          <div className="md:w-1/2 lg:w-2/5 flex flex-col items-center">
            {/* Recommendation section - visual enhancement */}
            <div className="mb-6 w-full max-w-md mx-auto animate-fade-in">
              <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 flex items-center border border-white/20 shadow-lg transform hover:scale-102 transition-all duration-300">
                <div className="bg-azleep-accent/30 rounded-full p-2 mr-3">
                  <Star className="h-5 w-5 text-[#FBBF24]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Tonight's Recommendation</p>
                  <p className="text-base font-medium text-azleep-text">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Main player section - enhanced visuals */}
            <div className="flex flex-col items-center justify-center mb-8 animate-fade-in relative">
              <div className={`w-60 h-60 mb-8 md:mb-6 md:w-64 md:h-64 lg:w-72 lg:h-72 ${isPlaying ? 'shadow-glow' : ''} relative`} style={{
                boxShadow: isPlaying ? '0 0 30px rgba(251, 191, 36, 0.5)' : 'none',
                transition: 'box-shadow 0.5s ease'
              }}>
                {/* Decorative circular rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 -m-3 animate-pulse-slow"></div>
                <div className="absolute inset-0 rounded-full border border-white/5 -m-6 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
                
                <AspectRatio ratio={1 / 1} className="relative">
                  <div className={`absolute inset-0 rounded-full sleep-card flex flex-col items-center justify-center ${isPlaying ? 'pulse-ring' : ''}`}>
                    <div className="text-center px-4 mb-4">
                      <p className="text-lg font-medium text-azleep-text mb-2">
                        {selectedCast.title}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedCast.description}
                      </p>
                      {/* Enhanced audio waveform visualization */}
                      {isPlaying && (
                        <div className="flex items-end justify-center h-12 gap-1.5 mb-2">
                          {[0, 1, 2, 3, 4].map(i => (
                            <div 
                              key={i} 
                              className="bg-[#FBBF24] w-2 rounded-full" 
                              style={{
                                height: `${20 + Math.sin(Date.now() / 500 + i) * 15}px`,
                                animation: 'pulse-audio 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-14 w-14 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-white border-none shadow-lg" 
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                  </div>
                </AspectRatio>
              </div>
              
              {/* Enhanced volume control */}
              <div className="flex items-center w-full max-w-xs md:max-w-sm mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Volume2 className="mr-3 h-5 w-5 text-muted-foreground" />
                <Slider 
                  defaultValue={[volume]} 
                  max={100} 
                  step={1} 
                  className="w-full" 
                  onValueChange={handleVolumeChange} 
                />
                <span className="ml-3 text-sm text-muted-foreground min-w-[30px]">{volume}%</span>
              </div>

              {/* Duration tag */}
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                  {selectedCast.duration}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right column for categories and list on larger screens */}
          <div className="md:w-1/2 lg:w-3/5">
            {/* Categories section - scrollable on mobile, grid on desktop */}
            <div className="mb-6">
              <div className="flex items-center justify-center md:justify-start gap-2 overflow-x-auto pb-2 no-scrollbar">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${activeCategory === 'All' ? 'bg-azleep-accent/20 text-azleep-text' : 'bg-white/10'} border-white/20 backdrop-blur-sm hover:bg-white/20`}
                  onClick={() => handleCategorySelect('All')}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${activeCategory === 'Nature' ? 'bg-azleep-accent/20 text-azleep-text' : 'bg-white/10'} border-white/20 backdrop-blur-sm hover:bg-white/20`}
                  onClick={() => handleCategorySelect('Nature')}
                >
                  Nature
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${activeCategory === 'Meditation' ? 'bg-azleep-accent/20 text-azleep-text' : 'bg-white/10'} border-white/20 backdrop-blur-sm hover:bg-white/20`}
                  onClick={() => handleCategorySelect('Meditation')}
                >
                  Meditation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${activeCategory === 'Stories' ? 'bg-azleep-accent/20 text-azleep-text' : 'bg-white/10'} border-white/20 backdrop-blur-sm hover:bg-white/20`}
                  onClick={() => handleCategorySelect('Stories')}
                >
                  Stories
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full ${activeCategory === 'Music' ? 'bg-azleep-accent/20 text-azleep-text' : 'bg-white/10'} border-white/20 backdrop-blur-sm hover:bg-white/20`}
                  onClick={() => handleCategorySelect('Music')}
                >
                  Music
                </Button>
              </div>
            </div>
            
            {/* Sleep cast list section - enhanced grid layout */}
            <div className="mb-20 md:mb-0 px-2">
              <h2 className="text-lg font-semibold text-azleep-text mb-4 flex items-center">
                <span className="bg-azleep-accent/30 rounded-full p-1 mr-2 inline-flex justify-center items-center">
                  <Star className="h-4 w-4 text-[#FBBF24]" />
                </span>
                {activeCategory === 'All' ? 'All Sleep Casts' : `${activeCategory} Sleep Casts`}
              </h2>
              
              {/* Desktop grid view - now using responsive grid columns */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
                {filteredCasts.map((cast, index) => (
                  <div 
                    key={cast.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <SleepCastCard {...cast} onPlay={() => handleCastSelect(cast)} />
                  </div>
                ))}
              </div>
              
              {/* Mobile view */}
              <div className="grid grid-cols-1 gap-4 md:hidden animate-fade-in">
                {filteredCasts.map((cast, index) => (
                  <div 
                    key={cast.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <SleepCastCard {...cast} onPlay={() => handleCastSelect(cast)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SleepCastPage;
