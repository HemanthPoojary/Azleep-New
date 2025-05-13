
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  image: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, image }) => (
  <div className="flex-1 flex flex-col items-center animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-[#8E44AD] flex items-center justify-center text-white text-2xl font-bold mb-4">
      {number}
    </div>
    <div className="rounded-xl overflow-hidden mb-4 w-full max-w-xs">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          {/* Placeholder for image */}
          <p className="text-gray-400">Image</p>
        </div>
      </AspectRatio>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300 text-center">{description}</p>
  </div>
);

interface HowItWorksSectionProps {
  appUrl: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ appUrl }) => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#1a1a2e] to-[#34323c]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Get Started in 3 Steps
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <StepCard number={1} title="Open Azleep Web App" description="No downloads required. Access instantly from any browser." image="https://placeholder-url.com/browser-mockup.jpg" />
          
          <StepCard number={2} title="Chat with AI Sleep Genie" description="Speak naturally and get personalized sleep guidance." image="https://placeholder-url.com/microphone-image.jpg" />
          
          <StepCard number={3} title="Rest Easy Tonight" description="Enjoy better sleep with AI-powered assistance." image="https://placeholder-url.com/starry-sky.jpg" />
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to={appUrl}>
            <Button size="lg" className="bg-[#8E44AD] hover:bg-[#9B59B6]">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
