
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeLocation {
  track_id: string;
  employeeid: string;
  customerid: string;
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
      .select(`
        track_id,
        employeeid,
        customerid,
        coordinates,
        timestamp,
        employee:employee!track_employeeid_fkey(firstname, lastname, jobtitle)
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching employee locations:', error);
      throw error;
    }

    // Transform coordinates array to latitude/longitude
    const transformedData: EmployeeLocation[] = (data || []).map(track => ({
      track_id: track.track_id,
      employeeid: track.employeeid,
      customerid: track.customerid,
      latitude: track.coordinates?.[0] || 0,
      longitude: track.coordinates?.[1] || 0,
      timestamp: track.timestamp || undefined,
      employee: track.employee || undefined
    }));

    return transformedData;
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
      coordinates: [latitude, longitude],
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('track')
      .insert(newLocation)
      .select(`
        track_id,
        employeeid,
        customerid,
        coordinates,
        timestamp,
        employee:employee!track_employeeid_fkey(firstname, lastname, jobtitle)
      `)
      .single();

    if (error) {
      console.error('Error updating employee location:', error);
      throw error;
    }

    return {
      track_id: data.track_id,
      employeeid: data.employeeid,
      customerid: data.customerid,
      latitude: data.coordinates?.[0] || 0,
      longitude: data.coordinates?.[1] || 0,
      timestamp: data.timestamp || undefined,
      employee: data.employee || undefined
    };
  } catch (error) {
    console.error('Error in updateEmployeeLocation:', error);
    throw error;
  }
};

export const enableRealtimeForTrackTable = async (): Promise<void> => {
  try {
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
