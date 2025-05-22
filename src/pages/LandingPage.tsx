
import React, { useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTAFooter from '@/components/landing/CTAFooter';
import AppNavigationMenu from '@/components/landing/NavigationMenu';

// App URL for all redirects
const APP_URL = "/app/onboarding";

const LandingPage: React.FC = () => {
  // Add mobile viewport meta tag effects
  useEffect(() => {
    // Update viewport meta tag for better mobile experience
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // Apply full-screen mobile app feel
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.position = 'relative';
    
    // Clean up
    return () => {
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  return (
    <div className="min-h-[100vh] overflow-x-hidden">
      <Header />
      
      {/* Navigation Menu - added for better app touring */}
      <div className="w-full py-2 px-4 bg-gradient-to-r from-[#341a5e]/95 to-[#5a318c]/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
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
