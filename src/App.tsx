
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import StatsPage from "./pages/StatsPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import SleepCastPage from "./pages/SleepCastPage";
import DailyCheckInPage from "./pages/DailyCheckInPage";
import LandingPage from "./pages/LandingPage";
import JournalPage from "./pages/JournalPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/app/stats" element={<StatsPage />} />
          <Route path="/app/journal" element={<JournalPage />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/onboarding" element={<Navigate to="/app/onboarding" />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
          <Route path="/voice" element={<Navigate to="/app/check-in" />} />
          <Route path="/sleep-cast" element={<Navigate to="/app/sleep-cast" />} />
          <Route path="/stats" element={<Navigate to="/app/stats" />} />
          <Route path="/journal" element={<Navigate to="/app/journal" />} />
          
          {/* Redirect old voice route to check-in */}
          <Route path="/app/voice" element={<Navigate to="/app/check-in" />} />
          
          {/* Handle 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
