import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { JournalPrompts } from '@/components/journal/JournalPrompts';
import { JournalSidebar } from '@/components/journal/JournalSidebar';
import { JournalEntryModal } from '@/components/journal/JournalEntryModal';
import JournalList from '@/components/journal/JournalList';
import VoiceJournal from '@/components/journal/VoiceJournal';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PenLine, BookOpen, Star, Calendar, MessageCircle, List, Bot } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRelaxationPoints } from '@/hooks/use-relaxation-points';

interface LocationState {
  mood?: string;
  promptType?: string;
}

const JournalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const isMobile = useIsMobile();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'prompts' | 'voice'>('list');
  const [moodFromCheckIn, setMoodFromCheckIn] = useState<string | undefined>(undefined);
  const [promptTypeFromCheckIn, setPromptTypeFromCheckIn] = useState<string | undefined>(undefined);
  const { user, loading } = useAuth();
  const { points, getCurrentStreak } = useRelaxationPoints();

  // Handle navigation state for mood and prompt type
  useEffect(() => {
    if (state?.mood) {
      setMoodFromCheckIn(state.mood);
      setPromptTypeFromCheckIn(state.promptType);
      
      // If we have a mood from check-in, automatically set the active view to voice
      setActiveView('voice');
      
      // Clear the location state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
      
      toast(`Ready to journal about how you're feeling ${state.mood.toLowerCase()}?`);
    }
  }, [state]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Handle successful journal entry completion
  const handleJournalEntryComplete = () => {
    toast("Journal entry saved! Keep up the great work! ✨", {
      description: "Your thoughts have been safely stored.",
      duration: 4000,
    });
  };

  return (
    <PageContainer className="bg-gradient-sleep overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 pb-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-azleep-primary/20 p-3">
              <BookOpen className="h-6 w-6 text-azleep-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Journal</h1>
              <p className="text-gray-300">A space for your thoughts and reflections</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Gamification elements */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">{points?.total_points || 0} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">{getCurrentStreak()} day streak</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowEntryModal(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
            >
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Journal View */}
          <div className="flex-1 min-h-[60vh]">
            {/* View Toggle */}
            <div className="flex mb-4 bg-white/5 backdrop-blur-sm rounded-lg p-1">
              <Button
                variant={activeView === 'list' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('list')}
                className="flex-1 font-normal"
              >
                <List className="h-4 w-4 mr-1" />
                Entries
              </Button>
              <Button
                variant={activeView === 'prompts' ? 'default' : 'ghost'}
                onClick={() => setActiveView('prompts')} 
                className="flex-1 font-normal"
              >
                Prompts
              </Button>
              <Button
                variant={activeView === 'voice' ? 'default' : 'ghost'}
                onClick={() => setActiveView('voice')} 
                className="flex-1 font-normal"
              >
                <Bot className="h-4 w-4 mr-1" />
                AI Assistant
              </Button>
            </div>
            
            {/* Active Content */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[50vh] transition-all">
              {activeView === 'list' ? (
                <JournalList onEntrySaved={handleJournalEntryComplete} />
              ) : activeView === 'prompts' ? (
                <JournalPrompts 
                  initialCategory={promptTypeFromCheckIn} 
                  onEntrySaved={handleJournalEntryComplete}
                />
              ) : (
                <VoiceJournal
                  initialMood={moodFromCheckIn}
                  onEntrySaved={handleJournalEntryComplete}
                />
              )}
            </div>

            {/* Mobile-only gamification display */}
            <div className="flex md:hidden items-center justify-center gap-6 mt-4 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-white">{points?.total_points || 0} points</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-white">{getCurrentStreak()} day streak</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Sidebar (hidden on mobile) */}
          {!isMobile && (
            <div className="lg:w-80 lg:min-w-80">
              <JournalSidebar />
            </div>
          )}
        </div>
        
        {/* Journal Entry Modal */}
        <JournalEntryModal 
          isOpen={showEntryModal}
          onClose={() => setShowEntryModal(false)}
          onEntrySaved={handleJournalEntryComplete}
        />
      </div>
    </PageContainer>
  );
};

export default JournalPage;
