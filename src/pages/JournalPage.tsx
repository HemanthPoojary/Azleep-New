
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { JournalCanvas } from '@/components/journal/JournalCanvas';
import { JournalPrompts } from '@/components/journal/JournalPrompts';
import { JournalSidebar } from '@/components/journal/JournalSidebar';
import { JournalEntryModal } from '@/components/journal/JournalEntryModal';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PenLine, BookOpen, Star, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [activeView, setActiveView] = useState<'canvas' | 'prompts'>('canvas');
  const [moodFromCheckIn, setMoodFromCheckIn] = useState<string | undefined>(undefined);
  const [promptTypeFromCheckIn, setPromptTypeFromCheckIn] = useState<string | undefined>(undefined);
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const { user } = useAuth();

  // Fetch user streak and points from database
  useEffect(() => {
    const fetchUserGamification = async () => {
      if (!user) return;

      try {
        // This would ideally fetch from a gamification table
        // For now, we'll use the count of journal entries as a simple streak/points system
        const { data, error } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          // Calculate streak based on how many consecutive days user has journaled
          // For now, just use the count as an approximation
          setStreakCount(Math.min(data.length, 7)); // Cap at 7 for demo
          setPoints(data.length * 10); // 10 points per journal entry
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      }
    };

    fetchUserGamification();
  }, [user]);

  // Handle navigation state for mood and prompt type
  useEffect(() => {
    if (state?.mood) {
      setMoodFromCheckIn(state.mood);
      setPromptTypeFromCheckIn(state.promptType);
      
      // If we have a mood from check-in, automatically show the journal entry modal
      setShowEntryModal(true);
      
      // Clear the location state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
      
      // Set the active view to prompts if coming from a check-in
      setActiveView('prompts');
      
      toast(`Ready to write about how you're feeling ${state.mood.toLowerCase()}?`);
    }
  }, [state]);

  // Handle successful journal entry completion
  const handleJournalEntryComplete = () => {
    // Update points and streak in UI immediately
    setPoints(prev => prev + 10);
    setStreakCount(prev => Math.min(prev + 1, 7));
    
    toast("Journal entry saved! +10 points", {
      description: "Keep up your journaling streak for bonus rewards!",
      action: {
        label: "View Streaks",
        onClick: () => toast("Streak feature coming soon!")
      }
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
                <span className="text-sm text-white">{points} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">{streakCount} day streak</span>
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
                variant={activeView === 'canvas' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('canvas')}
                className="flex-1 font-normal"
              >
                Canvas
              </Button>
              <Button
                variant={activeView === 'prompts' ? 'default' : 'ghost'}
                onClick={() => setActiveView('prompts')} 
                className="flex-1 font-normal"
              >
                Prompts
              </Button>
            </div>
            
            {/* Active Content */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[50vh] transition-all">
              {activeView === 'canvas' ? (
                <JournalCanvas onEntrySaved={handleJournalEntryComplete} />
              ) : (
                <JournalPrompts 
                  initialCategory={promptTypeFromCheckIn} 
                  onEntrySaved={handleJournalEntryComplete}
                />
              )}
            </div>

            {/* Mobile-only gamification display */}
            <div className="flex md:hidden items-center justify-center gap-6 mt-4 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-white">{points} points</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-white">{streakCount} day streak</span>
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
        
        {/* Entry Modal */}
        <JournalEntryModal 
          isOpen={showEntryModal} 
          onClose={() => setShowEntryModal(false)}
          initialMood={moodFromCheckIn}
          onEntrySaved={handleJournalEntryComplete}
        />
      </div>
    </PageContainer>
  );
};

export default JournalPage;
