import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useRelaxationPoints } from '@/hooks/use-relaxation-points';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string;
}

interface JournalListProps {
  onEntrySaved?: () => void;
}

const getMoodEmoji = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'anxious': return '😰';
    case 'calm': return '😌';
    case 'excited': return '🤩';
    case 'tired': return '😴';
    case 'sleepy': return '😴';
    case 'upset': return '😭';
    case 'reflective': return '🤔';
    default: return '📝';
  }
};

const getMoodColor = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'happy': return 'bg-yellow-500';
    case 'sad': return 'bg-blue-500';
    case 'anxious': return 'bg-red-500';
    case 'calm': return 'bg-green-500';
    case 'excited': return 'bg-orange-500';
    case 'tired': return 'bg-indigo-500';
    case 'sleepy': return 'bg-indigo-500';
    case 'upset': return 'bg-red-600';
    case 'reflective': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

const JournalList: React.FC<JournalListProps> = ({ onEntrySaved }) => {
  const { user } = useAuth();
  const { addPoints } = useRelaxationPoints();
  const queryClient = useQueryClient();
  const [newEntry, setNewEntry] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch journal entries
  const { data: journals, isLoading: isLoadingJournals, error } = useQuery({
    queryKey: ['journal_entries', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user
  });

  const handleSaveQuickEntry = async () => {
    if (!newEntry.trim()) {
      toast("Please write something first");
      return;
    }
    
    if (!user) {
      toast("You must be logged in to save entries");
      return;
    }
    
    try {
      setIsLoading(true);
      setSaveStatus('saving');
      
      // Add to database
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: `Quick entry - ${format(new Date(), 'MMM d, yyyy')}`,
          content: newEntry,
          mood: 'Reflective'
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        // Add relaxation points for journaling
        await addPoints(15, 'Journal Entry');
        
        // Clear the input
        setNewEntry('');
        setSaveStatus('saved');
        
        // Refresh the journal list
        queryClient.invalidateQueries({ queryKey: ['journal_entries', user.id] });
        
        // Call the callback to update points/streak
        if (onEntrySaved) {
          onEntrySaved();
        }
        
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSaveStatus('error');
      toast("Failed to save entry. Please try again.");
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the journal list
      queryClient.invalidateQueries({ queryKey: ['journal_entries', user.id] });
      toast.success('Journal entry deleted successfully');
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal entry');
    }
  };

  if (isLoadingJournals) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-azleep-accent mx-auto mb-4"></div>
          <p>Loading your journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-400">Error loading journals: {error.message}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Entry Area */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Quick Journal Entry</h3>
            <AutoSaveIndicator status={saveStatus} className="text-sm" />
          </div>
          
          <Textarea
            placeholder="What's on your mind today?"
            className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none mb-4"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveQuickEntry}
              className="bg-azleep-accent hover:bg-azleep-accent/80"
              disabled={isLoading || !newEntry.trim()}
            >
              {isLoading ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Your Journal Entries</h2>
        
        {journals && journals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journals.map((journal) => (
              <Card 
                key={journal.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white line-clamp-1">
                        {journal.title || 'Untitled Entry'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {format(new Date(journal.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" title={journal.mood || 'No mood set'}>
                        {getMoodEmoji(journal.mood)}
                      </span>
                      {journal.mood && (
                        <div className={`px-2 py-1 rounded-full text-xs text-white ${getMoodColor(journal.mood)}`}>
                          {journal.mood}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 line-clamp-4 mb-4 text-sm leading-relaxed">
                    {journal.content}
                  </p>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:text-azleep-accent text-gray-400"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:text-red-400 text-gray-400"
                      onClick={() => handleDelete(journal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl text-white mb-2">No journal entries yet</h3>
              <p className="text-gray-400 mb-6">
                Start journaling to track your thoughts and feelings
              </p>
              <Button 
                className="bg-azleep-accent hover:bg-azleep-accent/90"
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  textarea?.focus();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalList; 