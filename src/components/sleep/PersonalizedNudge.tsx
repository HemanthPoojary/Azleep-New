
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, ThumbsUp, ThumbsDown, Coffee } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  const [nudgeIndex, setNudgeIndex] = useState(0);

  // Fetch personalized nudges
  const { data: nudges, isLoading, refetch } = useQuery({
    queryKey: ['sleepNudges', age, occupation, sleepIssues],
    queryFn: async () => {
      // Build our query
      let query = supabase.from('sleep_nudges').select('*');
      
      // Apply age filter if available
      if (age) {
        query = query
          .or(`target_age_min.lte.${age},target_age_min.is.null`)
          .or(`target_age_max.gte.${age},target_age_max.is.null`);
      }
      
      // Apply occupation filter if available
      if (occupation) {
        query = query.or(`target_occupation.cs.{"${occupation}"},target_occupation.is.null`);
      }
      
      // Apply sleep issues filter if available
      if (sleepIssues && sleepIssues.length > 0) {
        // For simplicity, we'll just use the first sleep issue
        const issue = sleepIssues[0];
        query = query.or(`target_sleep_issues.cs.{"${issue}"},target_sleep_issues.is.null`);
      }
      
      // Order by priority and fetch results
      const { data, error } = await query.order('priority');
      
      if (error) throw error;
      
      // If no personalized nudges, fetch any nudge
      if (data.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('sleep_nudges')
          .select('*')
          .limit(5);
          
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      
      return data;
    }
  });

  const currentNudge = nudges && nudges.length > 0 
    ? nudges[nudgeIndex % nudges.length] 
    : null;

  const fetchNewNudge = () => {
    if (nudges && nudges.length > 0) {
      setNudgeIndex((prevIndex) => (prevIndex + 1) % nudges.length);
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    toast(helpful ? "Thanks! Glad this was helpful." : "Thanks for the feedback. We'll use it to improve our suggestions.");
    
    // In a full implementation, we'd store this feedback
    // For now, just fetch a new nudge after feedback
    fetchNewNudge();
  };

  if (isLoading) {
    return (
      <Card className="sleep-card animate-pulse">
        <CardContent className="p-4">
          <div className="h-5 w-1/3 bg-gray-700 rounded mb-4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!currentNudge) {
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
            onClick={fetchNewNudge}
          >
            <Coffee className="h-3 w-3 mr-1" /> New Tip
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-white mb-1">{currentNudge.title}</h4>
          <p className="text-sm text-white/80">{currentNudge.content}</p>
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
