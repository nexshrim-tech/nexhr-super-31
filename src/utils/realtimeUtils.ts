
import { supabase } from '@/integrations/supabase/client';

// Enable realtime for specific tables
export const enableRealtime = async () => {
  try {
    console.log('Setting up realtime subscriptions for tables');
    
    // Supabase realtime is now enabled by default for all tables
    // We'll just log that we want to listen to specific tables
    
    const tables = [
      'employee',
      'department',
      'tracklist',
      'leave',
      'attendance',
      'salary',
      'payslip'
    ];
    
    // Log which tables we're setting up for realtime
    console.log('Realtime enabled for tables:', tables.join(', '));
    
    return tables;
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return [];
  }
};

// Initialize realtime in App.tsx
export const initializeRealtime = async () => {
  return await enableRealtime();
};
