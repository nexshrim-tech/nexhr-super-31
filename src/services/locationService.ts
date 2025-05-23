
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeLocation {
  trackid?: number;
  employeeid: number;
  customerid: number;
  latitude: number;
  longitude: number;
  timestamp?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

export const getEmployeeLocations = async (): Promise<EmployeeLocation[]> => {
  try {
    const { data, error } = await supabase
      .from('track')
      .select('*, employee:employeeid(firstname, lastname, jobtitle)')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching employee locations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEmployeeLocations:', error);
    throw error;
  }
};

export const updateEmployeeLocation = async (
  employeeId: number, 
  customerId: number, 
  latitude: number, 
  longitude: number
): Promise<EmployeeLocation> => {
  try {
    const newLocation = {
      employeeid: employeeId,
      customerid: customerId,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('track')
      .insert(newLocation)
      .select('*, employee:employeeid(firstname, lastname, jobtitle)')
      .single();

    if (error) {
      console.error('Error updating employee location:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateEmployeeLocation:', error);
    throw error;
  }
};

export const enableRealtimeForTrackTable = async (): Promise<void> => {
  try {
    // Create a channel for realtime updates instead of using the deprecated method
    const channel = supabase
      .channel('track-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'track'
        },
        payload => {
          console.log('Track change received', payload);
        }
      )
      .subscribe();
      
    console.log('Realtime enabled for track table');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error enabling realtime for track table:', error);
    return Promise.reject(error);
  }
};
