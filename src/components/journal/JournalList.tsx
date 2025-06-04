import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
}

const getMoodEmoji = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'anxious': return '😰';
    case 'calm': return '😌';
    case 'excited': return '🤩';
    default: return '📝';
  }
};

const JournalList = () => {
  const { user } = useAuth();
  
  // Fetch journal entries
  const { data: journals, isLoading, error } = useQuery({
    queryKey: ['journals', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Journal entry deleted successfully');
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal entry');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error loading journals: {error.message}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-azleep-text">My Journal</h2>
        <Button className="bg-azleep-accent hover:bg-azleep-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {journals && journals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <div 
              key={journal.id} 
              className="sleep-card p-4 hover:border-azleep-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-medium text-azleep-text line-clamp-1">
                    {journal.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(journal.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="text-2xl" title={journal.mood || 'No mood set'}>
                  {getMoodEmoji(journal.mood)}
                </span>
              </div>
              
              <p className="text-gray-300 line-clamp-3 mb-4">
                {journal.content}
              </p>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:text-azleep-accent"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:text-red-500"
                  onClick={() => handleDelete(journal.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sleep-card">
          <p className="text-lg text-azleep-text mb-2">No journal entries yet</p>
          <p className="text-gray-400 mb-4">
            Start journaling to track your thoughts and feelings
          </p>
          <Button className="bg-azleep-accent hover:bg-azleep-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default JournalList; 