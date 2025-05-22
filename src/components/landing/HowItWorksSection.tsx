
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
  <div className="flex-1 flex flex-col items-center animate-fade-in p-4">
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#8E44AD] flex items-center justify-center text-white text-xl md:text-2xl font-bold mb-4">
      {number}
    </div>
    <div className="rounded-xl overflow-hidden mb-4 w-full max-w-xs">
      <AspectRatio ratio={16 / 9}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </AspectRatio>
    </div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 text-white text-center">{title}</h3>
    <p className="text-gray-300 text-center text-sm md:text-base">{description}</p>
  </div>
);

interface HowItWorksSectionProps {
  appUrl: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ appUrl }) => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-b from-[#1a1a2e] to-[#34323c]">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-white">
          Get Started in 3 Steps
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          <StepCard 
            number={1} 
            title="Open Azleep Web App" 
            description="No downloads required. Access instantly from any browser." 
            image="/Open Azleep Web App.png" 
          />
          
          <StepCard 
            number={2} 
            title="Chat with AI Sleep Genie" 
            description="Speak naturally and get personalized sleep guidance." 
            image="/Chat with AI Sleep Genie.png" 
          />
          
          <StepCard 
            number={3} 
            title="Rest Easy Tonight" 
            description="Enjoy better sleep with AI-powered assistance." 
            image="/Rest Easy Tonight.png" 
          />
        </div>
        
        <div className="flex justify-center mt-8 md:mt-12">
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
