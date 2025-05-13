
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import PageContainer from '@/components/layout/PageContainer';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [permissionRequested, setPermissionRequested] = useState(false);
  
  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionRequested(true);
      toast.success("Microphone access granted!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error("Please allow microphone access to use voice features");
    }
  };

  const handleStart = () => {
    requestMicrophoneAccess();
  };

  return (
    <PageContainer withBottomNav={false} className="flex items-center justify-center">
      <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-azleep-accent/20 p-6">
          <Moon className="h-12 w-12 text-azleep-accent animate-pulse-slow" />
        </div>
        
        <h1 className="mb-2 text-3xl font-bold text-azleep-text">
          Welcome to Azleep
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your AI Sleep Companion
        </p>
        
        <Button 
          size="lg" 
          className="bg-azleep-accent hover:bg-azleep-accent/90 text-white px-8 py-6 text-lg transition-all duration-300 animate-fade-in"
          onClick={handleStart}
        >
          Start Your Journey
        </Button>
      </div>
    </PageContainer>
  );
};

export default OnboardingPage;
