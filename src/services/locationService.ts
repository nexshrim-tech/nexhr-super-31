
import { supabase } from '@/integrations/supabase/client';

export interface EmployeeLocation {
  trackid?: number;
  employeeid: number;
  customerid: number;
  latitude: number;
  longitude: number;
  timestamp?: string;
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
    // Enable realtime on the track table
    await supabase
      .from('track')
      .on('*', payload => {
        console.log('Track change received', payload);
      })
      .subscribe();
      
    console.log('Realtime enabled for track table');
  } catch (error) {
    console.error('Error enabling realtime for track table:', error);
  }
};
