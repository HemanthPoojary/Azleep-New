import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
interface HeroSectionProps {
  appUrl: string;
}
const HeroSection: React.FC<HeroSectionProps> = ({
  appUrl
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Google Form URL for the waitlist
  const waitlistFormUrl = "https://docs.google.com/forms/d/1JsgB8-uNH6fjo3E4DNtFUiaojHnEL5SmkBfo0DjT-5Q/viewform";
  return <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2C3E50] to-[#8E44AD] p-6">
      {/* Animated stars background */}
      <div className="stars-container">
        {Array.from({
        length: 50
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-white animate-pulse-slow" style={{
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`
      }} />)}
        {/* Moon */}
        <div className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-200 opacity-80 top-10 right-10 shadow-lg"></div>
      </div>
      
      <div className="container mx-auto text-center z-10 relative">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white leading-tight font-sans py-0 my-0 mx-0 md:text-4xl">
          Sleep Better with Azleep's AI Web App
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Access AI-driven sleep solutions instantly in your browser.
        </p>
        
        <div className="flex flex-col gap-6">
          {/* First row with Start Now and Join Waitlist buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to={appUrl}>
              <Button size="lg" className="text-lg h-12 px-8 w-full md:w-auto bg-white text-[#8E44AD] hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                Start Now
              </Button>
            </Link>
            
            <a href={waitlistFormUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg h-12 px-8 w-full md:w-auto text-white shadow-md hover:shadow-lg transition-all duration-300 bg-[#240740]">
                Join Waitlist
              </Button>
            </a>
          </div>
          
          {/* Second row with centered Try a Mini Sleep Cast button */}
          <div className="flex justify-center">
            <Button onClick={toggleAudio} variant="outline" size="lg" className={`text-lg h-12 px-8 w-full md:w-auto max-w-xs mx-auto border-white text-white hover:bg-white/10 ${isAudioPlaying ? 'bg-white/20' : ''}`}>
              {isAudioPlaying ? 'Stop' : 'Try a Mini Sleep Cast'}
            </Button>
          </div>
          
          <audio ref={audioRef} src="/mini-sleep-cast.mp3" onEnded={() => setIsAudioPlaying(false)} />
        </div>
      </div>
    </section>;
};
export default HeroSection;