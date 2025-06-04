import React, { useEffect } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTAFooter from '@/components/landing/CTAFooter';

// App URL for all redirects
const APP_URL = "/auth";

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
      <HeroSection appUrl={APP_URL} />
      <FeaturesSection appUrl={APP_URL} />
      <HowItWorksSection appUrl={APP_URL} />
      <CTAFooter appUrl={APP_URL} />
    </div>
  );
};

export default LandingPage;
