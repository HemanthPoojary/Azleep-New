import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
}

const MOODS = [
  { value: 'happy', label: 'Happy 😊' },
  { value: 'calm', label: 'Calm 😌' },
  { value: 'anxious', label: 'Anxious 😰' },
  { value: 'sad', label: 'Sad 😢' },
  { value: 'excited', label: 'Excited 🤩' }
];

const Journals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: ''
  });

  // Fetch journals on component mount
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchJournals();
  }, [user, navigate]);

  const fetchJournals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            content: formData.content,
            mood: formData.mood || null
          }
        ]);

      if (error) throw error;

      toast.success('Journal entry saved successfully!');
      setShowForm(false);
      setFormData({ title: '', content: '', mood: '' });
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      toast.error('Failed to save journal entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Journal entry deleted');
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal entry');
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-azleep-text">My Journal</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-azleep-accent hover:bg-azleep-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-azleep-dark border-white/10">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-azleep-text">New Journal Entry</DialogTitle>
                  <DialogDescription>
                    Write down your thoughts and feelings
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Textarea
                    placeholder="Write your thoughts here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="min-h-[150px] bg-white/5 border-white/10"
                    required
                  />
                  <Select
                    value={formData.mood}
                    onValueChange={(value) => setFormData({ ...formData, mood: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent className="bg-azleep-dark border-white/10">
                      {MOODS.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value}>
                          {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-azleep-accent hover:bg-azleep-accent/90">
                    Save Entry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner className="w-8 h-8" />
          </div>
        ) : journals.length > 0 ? (
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
                    {MOODS.find(m => m.value === journal.mood)?.label.split(' ')[1] || '📝'}
                  </span>
                </div>
                
                <p className="text-gray-300 line-clamp-3 mb-4">
                  {journal.content}
                </p>
                
                <div className="flex justify-end gap-2">
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
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-azleep-accent hover:bg-azleep-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Entry
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Journals; 