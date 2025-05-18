
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Star, Headphones, MessageCircle, BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data - in a real app this would come from a database
const mockEntries = [
  {
    id: 1,
    date: 'May 17, 2025',
    content: 'Today I practiced mindfulness for 15 minutes and felt much calmer afterward. I noticed that my sleep was improved as well.',
    mood: 'Peaceful',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    date: 'May 15, 2025',
    content: 'Feeling anxious about tomorrow\'s presentation, but I tried some breathing exercises that helped calm my nerves.',
    mood: 'Anxious',
    color: 'bg-purple-500',
  }
];

export const JournalCanvas = () => {
  const [entries, setEntries] = useState(mockEntries);
  const [newEntry, setNewEntry] = useState('');
  
  const handleSaveQuickEntry = () => {
    if (!newEntry.trim()) {
      toast("Please write something first");
      return;
    }
    
    // Add new entry
    const newEntryObj = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: newEntry,
      mood: 'Reflective',
      color: 'bg-indigo-500',
    };
    
    setEntries([newEntryObj, ...entries]);
    setNewEntry('');
    toast("Entry saved to your journal");
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
          >
            Save Thought
          </Button>
        </div>
      </div>
      
      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-white/90">Previous Entries</h3>
        
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="backdrop-blur-sm bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all hover-scale"
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
      </div>
    </div>
  );
};
