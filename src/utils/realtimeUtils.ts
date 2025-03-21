
import { supabase } from '@/integrations/supabase/client';

// Enable realtime for specific tables
export const enableRealtime = async () => {
  try {
    // First, make sure realtime is enabled for the tables
    await supabase.rpc('enable_table_realtime', {
      table_name: 'employee'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'department'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'tracklist'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'leave'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'attendance'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'salary'
    });
    
    await supabase.rpc('enable_table_realtime', {
      table_name: 'payslip'
    });
    
    console.log('Realtime enabled for all tables');
  } catch (error) {
    console.error('Error enabling realtime:', error);
  }
};

// This should be called when the app first starts
// You can add this to your root App component
