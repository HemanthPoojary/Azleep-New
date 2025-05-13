
import React from 'react';
import { Mic, Music, Heart, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="sleep-card hover-scale">
    <CardContent className="flex flex-col items-center text-center p-6">
      <div className="text-[#8E44AD] mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

interface FeaturesSectionProps {
  appUrl: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ appUrl }) => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#2C3E50] to-[#1a1a2e]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          What Azleep Offers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard icon={<Mic size={40} />} title="AI Sleep Genie" description="Your personal sleep coach that understands your needs and provides tailored guidance." />
          
          <FeatureCard icon={<Music size={40} />} title="Personalized Sleep Casts" description="Stories and soundscapes designed to help you fall asleep faster and sleep deeper." />
          
          <FeatureCard icon={<Heart size={40} />} title="Mood Tracking" description="Voice-based stress insights that help you understand your mental wellbeing patterns." />
          
          <FeatureCard icon={<Moon size={40} />} title="Late-Night Nudges" description="Gentle reminders to unwind and prepare for sleep at the right time." />
        </div>

        <div className="mt-16 bg-[#1e293b] rounded-xl p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Hear AI Sleep Genie in action</h3>
          <div className="flex items-center justify-center">
            <a href={appUrl} target="_blank" rel="noopener noreferrer">
              <Button className="flex items-center gap-2">
                <Mic size={18} />
                Try it now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
