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
import { StorageDemo } from "./pages/StorageDemo";
import { AuthProvider } from "./contexts/AuthContext";
import FloatingAssistant from "./components/sleep/FloatingAssistant";
import { ElevenLabsDemo } from "./pages/ElevenLabsDemo";
import AuthPage from "./pages/AuthPage";
import DreamNarrativesPage from "./pages/DreamNarrativesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page is the main entry point */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Web app routes */}
            <Route path="/app" element={<Navigate to="/app/onboarding" />} />
            <Route path="/app/onboarding" element={<OnboardingPage />} />
            <Route path="/app/welcome" element={<Index />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/check-in" element={<DailyCheckInPage />} />
            <Route path="/app/sleep-cast" element={<SleepCastPage />} />
            <Route path="/app/journal" element={<JournalPage />} />
            <Route path="/app/storage" element={<StorageDemo />} />
            <Route path="/app/elevenlabs" element={<ElevenLabsDemo />} />
            <Route path="/app/dream-narratives" element={<DreamNarrativesPage />} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/onboarding" element={<Navigate to="/app/onboarding" />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
            <Route path="/sleep-cast" element={<Navigate to="/app/sleep-cast" />} />
            <Route path="/stats" element={<Navigate to="/app/dashboard" />} />
            <Route path="/journal" element={<Navigate to="/app/journal" />} />
            
            {/* Redirect old routes */}
            <Route path="/app/stats" element={<Navigate to="/app/dashboard" />} />
            
            {/* Auth route */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/auth" element={<Navigate to="/login" />} />
            
            {/* Handle 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Floating voice assistant */}
          <FloatingAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
