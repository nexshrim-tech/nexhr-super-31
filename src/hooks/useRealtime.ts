
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Entity = 'employee' | 'department' | 'tracklist' | 'leave' | 'attendance' | 'salary' | 'payslip';
type Event = 'INSERT' | 'UPDATE' | 'DELETE';
type ChangeHandler = (payload: RealtimePostgresChangesPayload<any>) => void;

export const useRealtime = (entity: Entity, events: Event[], onChanges: ChangeHandler) => {
  useEffect(() => {
    console.log(`Setting up realtime subscription for ${entity} table, events: ${events.join(', ')}`);
    
    // Create a channel with a specific name
    const channelName = `${entity}-changes`;
    
    // Build the channel with correct event configuration
    const channel = supabase.channel(channelName);
    
    // Add subscription for each event type separately
    events.forEach(event => {
      channel.on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: entity
        },
        (payload) => {
          console.log(`Realtime change detected for ${entity} (${event}):`, payload);
          onChanges(payload);
        }
      );
    });
    
    // Subscribe to the channel
    channel.subscribe((status) => {
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
