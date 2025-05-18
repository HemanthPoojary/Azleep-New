
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { JournalCanvas } from '@/components/journal/JournalCanvas';
import { JournalPrompts } from '@/components/journal/JournalPrompts';
import { JournalSidebar } from '@/components/journal/JournalSidebar';
import { JournalEntryModal } from '@/components/journal/JournalEntryModal';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PenLine, BookOpen } from 'lucide-react';

const JournalPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [activeView, setActiveView] = useState<'canvas' | 'prompts'>('canvas');

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
          
          <Button 
            onClick={() => setShowEntryModal(true)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
          >
            <PenLine className="mr-2 h-4 w-4" />
            New Entry
          </Button>
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
                <JournalCanvas />
              ) : (
                <JournalPrompts />
              )}
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
        />
      </div>
    </PageContainer>
  );
};

export default JournalPage;
