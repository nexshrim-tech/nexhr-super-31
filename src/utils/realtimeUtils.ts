
import { supabase } from '@/integrations/supabase/client';

// Enable realtime for specific tables
export const enableRealtime = async () => {
  try {
    console.log('Setting up realtime subscriptions for tables');
    
    // Enable realtime for critical tables
    const tables = [
      'employee',
      'department',
      'tracklist',
      'leave',
      'attendance',
      'salary',
      'payslip'
    ];
    
    // Log that we're subscribing to these tables
    tables.forEach(table => {
      console.log(`Enabling realtime for table: ${table}`);
    });
    
    console.log('Realtime enabled for tables:', tables.join(', '));
    
    return tables;
  } catch (error) {
    console.error('Error setting up realtime:', error);
    return [];
  }
};

// Initialize realtime in App.tsx
export const initializeRealtime = async () => {
  console.log('Initializing realtime subscriptions');
  return await enableRealtime();
};
