
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Star, MessageCircle, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface JournalCanvasProps {
  onEntrySaved?: () => void;
}

export const JournalCanvas: React.FC<JournalCanvasProps> = ({ onEntrySaved }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch journal entries from database
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data) {
          setEntries(data.map(entry => ({
            id: entry.id,
            date: format(new Date(entry.created_at), 'MMM d, yyyy'),
            content: entry.content,
            mood: entry.mood || 'Reflective',
            color: getMoodColor(entry.mood || 'Reflective'),
          })));
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        toast("Failed to load journal entries");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [user]);
  
  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      'Peaceful': 'bg-blue-500',
      'Grateful': 'bg-green-500',
      'Happy': 'bg-yellow-500',
      'Reflective': 'bg-purple-500',
      'Anxious': 'bg-amber-500',
      'Tired': 'bg-red-500',
      'Sad': 'bg-indigo-500',
    };
    
    return moodColors[mood] || 'bg-purple-500';
  };

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
      
      // Add to local state
      if (data && data[0]) {
        const newEntryObj = {
          id: data[0].id,
          date: format(new Date(), 'MMM d, yyyy'),
          content: newEntry,
          mood: 'Reflective',
          color: 'bg-indigo-500',
        };
        
        setEntries([newEntryObj, ...entries]);
        setNewEntry('');
        
        // Call the callback to update points/streak
        if (onEntrySaved) {
          onEntrySaved();
        } else {
          toast("Entry saved to your journal");
        }
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast("Failed to save entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Quick Entry Area */}
      <div className="mb-6">
        <Textarea
          placeholder="Write a quick thought or reflection here..."
          className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <Button 
            onClick={handleSaveQuickEntry}
            className="bg-azleep-primary hover:bg-azleep-primary/80"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Thought'}
          </Button>
        </div>
      </div>
      
      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-white/90">Previous Entries</h3>
        
        {isLoading && entries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading your journal entries...</p>
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card 
                key={entry.id} 
                className="backdrop-blur-sm bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all hover:scale-[1.01]"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{entry.date}</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${entry.color}`}>
                      {entry.mood}
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No journal entries yet. Start by writing your thoughts above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
