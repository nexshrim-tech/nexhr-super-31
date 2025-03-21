
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Entity = 'employee' | 'department' | 'tracklist' | 'leave' | 'attendance' | 'salary' | 'payslip';
type Event = 'INSERT' | 'UPDATE' | 'DELETE';
type ChangeHandler = (payload: RealtimePostgresChangesPayload<any>) => void;

export const useRealtime = (entity: Entity, events: Event[], onChanges: ChangeHandler) => {
  useEffect(() => {
    console.log(`Setting up realtime subscription for ${entity} table, events: ${events.join(', ')}`);
    
    // Create a channel with the correct format for Supabase JS client
    const channel = supabase
      .channel(`${entity}-changes`)
      .on(
        'postgres_changes', // This is the correct event type
        { 
          event: events,
          schema: 'public',
          table: entity
        },
        (payload) => {
          console.log(`Realtime change detected for ${entity}:`, payload);
          onChanges(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${entity}:`, status);
      });

    console.log(`Subscribed to realtime changes for ${entity} table, events: ${events.join(', ')}`);

    // Cleanup subscription on unmount
    return () => {
      console.log(`Cleaning up realtime subscription for ${entity}`);
      supabase.removeChannel(channel);
    };
  }, [entity, events, onChanges]);
};
