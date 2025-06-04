import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';

interface RealtimeConfig {
  table: string;
  queryKey: string[];
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export const useRealtimeData = (config: RealtimeConfig) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: config.queryKey });
  }, [queryClient, config.queryKey]);

  useEffect(() => {
    if (!user) return;

    let channel = supabase.channel(`realtime_${config.table}_${user.id}`);

    if (config.filter) {
      channel = channel.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: config.table,
          filter: config.filter 
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              config.onInsert?.(payload);
              invalidateQueries();
              break;
            case 'UPDATE':
              config.onUpdate?.(payload);
              invalidateQueries();
              break;
            case 'DELETE':
              config.onDelete?.(payload);
              invalidateQueries();
              break;
          }
        }
      );
    } else {
      channel = channel.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: config.table 
        },
        (payload) => {
          // Only process if it's the current user's data
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          if (newRecord?.user_id === user.id || oldRecord?.user_id === user.id) {
            switch (payload.eventType) {
              case 'INSERT':
                config.onInsert?.(payload);
                invalidateQueries();
                break;
              case 'UPDATE':
                config.onUpdate?.(payload);
                invalidateQueries();
                break;
              case 'DELETE':
                config.onDelete?.(payload);
                invalidateQueries();
                break;
            }
          }
        }
      );
    }

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [user, config, invalidateQueries]);

  return { isConnected };
};

// Hook for automatically saving data changes
export const useAutoSave = (
  table: string,
  data: Record<string, any>,
  delay: number = 1000
) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveData = useCallback(async (dataToSave: Record<string, any>) => {
    if (!user || !dataToSave || Object.keys(dataToSave).length === 0) return;

    setIsSaving(true);
    try {
      // Create a properly typed supabase query
      const query = supabase.from(table as any);
      
      // Check if record exists
      const { data: existingData, error: selectError } = await query
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw selectError;
      }

      if (existingData) {
        // Update existing record
        const { error } = await query
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await query
          .insert({ ...dataToSave, user_id: user.id });
        
        if (error) throw error;
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error(`Error saving to ${table}:`, error);
      toast.error(`Failed to save data to ${table}`);
    } finally {
      setIsSaving(false);
    }
  }, [user, table]);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const timeoutId = setTimeout(() => {
      saveData(data);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, delay, saveData]);

  return { isSaving, lastSaved };
};

// Hook for optimistic updates
export const useOptimisticUpdate = <T>(
  queryKey: string[],
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T
) => {
  const queryClient = useQueryClient();

  const updateOptimistically = useCallback(async (
    newData: Partial<T>,
    mutation: () => Promise<any>
  ) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey });

    // Snapshot previous value
    const previousData = queryClient.getQueryData<T>(queryKey);

    // Optimistically update
    queryClient.setQueryData<T>(queryKey, (old) => updateFn(old, newData));

    try {
      // Perform the actual mutation
      await mutation();
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(queryKey, previousData);
      throw error;
    }
  }, [queryClient, queryKey, updateFn]);

  return { updateOptimistically };
}; 