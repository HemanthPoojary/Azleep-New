
import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTAFooter from '@/components/landing/CTAFooter';
import AppNavigationMenu from '@/components/landing/NavigationMenu';

// App URL for all redirects
const APP_URL = "/app/onboarding";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Navigation Menu - added for better app touring */}
      <div className="w-full py-2 px-4 bg-gradient-to-r from-[#341a5e]/80 to-[#5a318c]/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <AppNavigationMenu />
      </div>
      
      <HeroSection appUrl={APP_URL} />
      <FeaturesSection appUrl={APP_URL} />
      <HowItWorksSection appUrl={APP_URL} />
      <CTAFooter appUrl={APP_URL} />
    </div>
  );
};

export default LandingPage;
