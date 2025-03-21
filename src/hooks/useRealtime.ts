
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Entity = 'employee' | 'department' | 'tracklist' | 'leave' | 'attendance' | 'salary' | 'payslip';
type Event = 'INSERT' | 'UPDATE' | 'DELETE';
type ChangeHandler = (payload: RealtimePostgresChangesPayload<any>) => void;

export const useRealtime = (entity: Entity, events: Event[], onChanges: ChangeHandler) => {
  useEffect(() => {
    // Create channel with correct subscription format
    // The issue is with the .on() method's first parameter
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes', // This is the event type
        { 
          event: events,
          schema: 'public',
          table: entity
        },
        onChanges
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [entity, events, onChanges]);
};
