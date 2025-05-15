
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeLocation {
  trackid?: string;
  employeeid: string;
  customerid: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  } | null;
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

    // Convert all IDs to strings to ensure type consistency
    return (data || []).map(item => ({
      trackid: String(item.trackid),
      employeeid: String(item.employeeid),
      customerid: String(item.customerid),
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      timestamp: item.timestamp,
      // Handle the case where employee might be an error object
      employee: typeof item.employee === 'object' && item.employee 
        ? {
            firstname: item.employee?.firstname || '',
            lastname: item.employee?.lastname || '',
            jobtitle: item.employee?.jobtitle || ''
          }
        : null
    }));
  } catch (error) {
    console.error('Error in getEmployeeLocations:', error);
    throw error;
  }
};

export const updateEmployeeLocation = async (
  employeeId: string, 
  customerId: string, 
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

    // Convert IDs to strings
    return {
      trackid: String(data.trackid),
      employeeid: String(data.employeeid),
      customerid: String(data.customerid),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      timestamp: data.timestamp,
      employee: typeof data.employee === 'object' && data.employee 
        ? {
            firstname: data.employee?.firstname || '',
            lastname: data.employee?.lastname || '',
            jobtitle: data.employee?.jobtitle || ''
          }
        : null
    };
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
