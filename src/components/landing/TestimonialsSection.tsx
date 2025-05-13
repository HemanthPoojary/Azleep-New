
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author }) => (
  <Card className="sleep-card">
    <CardContent className="p-6">
      <blockquote className="text-gray-200 italic mb-4">"{quote}"</blockquote>
      <p className="text-[#9B59B6] font-semibold">– {author}</p>
    </CardContent>
  </Card>
);

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#34323c] to-[#2C3E50]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          User Feedback
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <TestimonialCard quote="Azleep's voice coach is a game-changer! I've tried many sleep apps, but this is the first one that actually understands my sleep issues." author="Priya, 28" />
          
          <TestimonialCard quote="Sleep casts make bedtime relaxing. The Tamil folklore stories remind me of my childhood and help me drift off peacefully every night." author="Arjun, 34" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
