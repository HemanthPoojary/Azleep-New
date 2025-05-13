
import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTAFooter from '@/components/landing/CTAFooter';

// App URL for all redirects
const APP_URL = "/app/onboarding";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection appUrl={APP_URL} />
      <FeaturesSection appUrl={APP_URL} />
      <HowItWorksSection appUrl={APP_URL} />
      <TestimonialsSection />
      <CTAFooter appUrl={APP_URL} />
    </div>
  );
};

export default LandingPage;
