import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import SleepCastPage from "./pages/SleepCastPage";
import DailyCheckInPage from "./pages/DailyCheckInPage";
import LandingPage from "./pages/LandingPage";
import JournalPage from "./pages/JournalPage";
import AuthPage from "./pages/AuthPage";
import DreamNarrativesPage from "./pages/DreamNarrativesPage";
import VoiceInteractionPage from "./pages/VoiceInteractionPage";
import VoiceFirstSleepAssistant from "./pages/VoiceFirstSleepAssistant";
import { AuthProvider } from "./contexts/AuthContext";
import { useRealtimeSync } from "./hooks/useRealtimeSync";

const queryClient = new QueryClient();

// Component to handle real-time sync
const RealtimeSync: React.FC = () => {
  useRealtimeSync();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <RealtimeSync />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page is the main entry point */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth route for direct login */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Web app routes */}
            <Route path="/app" element={<Navigate to="/app/onboarding" />} />
            <Route path="/app/onboarding" element={<OnboardingPage />} />
            <Route path="/app/welcome" element={<Index />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/check-in" element={<DailyCheckInPage />} />
            <Route path="/app/sleep-cast" element={<SleepCastPage />} />
            <Route path="/app/journal" element={<JournalPage />} />
            <Route path="/app/dream-narratives" element={<DreamNarrativesPage />} />
            <Route path="/app/voice" element={<VoiceInteractionPage />} />
            <Route path="/app/sleep-assistant" element={<VoiceFirstSleepAssistant />} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/onboarding" element={<Navigate to="/app/onboarding" />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
            <Route path="/voice" element={<Navigate to="/app/voice" />} />
            <Route path="/sleep-cast" element={<Navigate to="/app/sleep-cast" />} />
            <Route path="/stats" element={<Navigate to="/app/dashboard" />} />
            <Route path="/journal" element={<Navigate to="/app/journal" />} />
            <Route path="/dream-narratives" element={<Navigate to="/app/dream-narratives" />} />
            
            {/* Redirect old routes */}
            <Route path="/app/stats" element={<Navigate to="/app/dashboard" />} />
            
            {/* Handle 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
