
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, ThumbsUp, ThumbsDown, Coffee } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface NudgeProps {
  age?: number;
  occupation?: string;
  sleepIssues?: string[];
}

interface SleepNudge {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: number;
}

const PersonalizedNudge: React.FC<NudgeProps> = ({ age, occupation, sleepIssues }) => {
  const [nudge, setNudge] = useState<SleepNudge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalizedNudge();
  }, [age, occupation, sleepIssues]);

  const fetchPersonalizedNudge = async () => {
    try {
      setLoading(true);
      
      // Query for personalized nudges
      let query = supabase
        .from('sleep_nudges')
        .select('*');
      
      // Apply age filter if available
      if (age) {
        query = query.lte('target_age_min', age).gte('target_age_max', age);
      }
      
      // Apply occupation filter if available
      if (occupation) {
        query = query.contains('target_occupation', [occupation]);
      }
      
      // Apply sleep issues filter if available
      if (sleepIssues && sleepIssues.length > 0) {
        query = query.overlaps('target_sleep_issues', sleepIssues);
      }
      
      // Order by priority
      query = query.order('priority', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching personalized nudge:', error);
        // Fallback to fetch any nudge if personalized query fails
        const { data: fallbackData } = await supabase
          .from('sleep_nudges')
          .select('*')
          .order('priority', { ascending: true })
          .limit(1);
          
        if (fallbackData && fallbackData.length > 0) {
          setNudge(fallbackData[0]);
        }
      } else if (data && data.length > 0) {
        // Select a random nudge from the results
        const randomIndex = Math.floor(Math.random() * data.length);
        setNudge(data[randomIndex]);
      } else {
        // Fallback to fetch any nudge if no personalized results
        const { data: fallbackData } = await supabase
          .from('sleep_nudges')
          .select('*')
          .order('priority', { ascending: true })
          .limit(1);
          
        if (fallbackData && fallbackData.length > 0) {
          setNudge(fallbackData[0]);
        }
      }
    } catch (error) {
      console.error('Error in nudge fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (helpful: boolean) => {
    toast(helpful ? "Thanks! Glad this was helpful." : "Thanks for the feedback. We'll use it to improve our suggestions.");
    // In a full implementation, we'd store this feedback
    fetchPersonalizedNudge(); // Fetch a new nudge after feedback
  };

  if (loading) {
    return (
      <Card className="sleep-card animate-pulse">
        <CardContent className="p-4">
          <div className="h-5 w-1/3 bg-gray-700 rounded mb-4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!nudge) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-azleep-dark to-azleep-primary/40 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Moon className="h-5 w-5 text-azleep-accent mr-2" />
            <h3 className="text-lg font-medium text-azleep-text">Sleep Genie</h3>
          </div>
          <Button
            variant="ghost" 
            size="sm"
            className="text-xs text-azleep-accent hover:text-azleep-accent hover:bg-white/10"
            onClick={fetchPersonalizedNudge}
          >
            <Coffee className="h-3 w-3 mr-1" /> New Tip
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-white mb-1">{nudge.title}</h4>
          <p className="text-sm text-white/80">{nudge.content}</p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => handleFeedback(false)}
          >
            <ThumbsDown className="h-3 w-3 mr-1" /> Not helpful
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => handleFeedback(true)}
          >
            <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedNudge;
