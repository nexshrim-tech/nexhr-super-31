
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  id?: number;
  customerid?: number;
  employeeid?: number;
  geofencingenabled: boolean;
  latethreshold: string;
  photoverificationenabled: boolean;
  workstarttime: string;
  workendtime?: string;
  created_at?: string;
}

type AttendanceSettingsData = Omit<AttendanceSettings, 'id'>;

export const getAttendanceSettings = async (employeeId?: number): Promise<AttendanceSettings[]> => {
  try {
    // Create the base query
    const query = supabase.from('attendancesettings').select('*');
    
    // Apply the filter if employeeId is provided
    const filteredQuery = employeeId 
      ? query.eq('employeeid', employeeId)
      : query;
    
    // Execute the query
    const { data, error } = await filteredQuery;

    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: Partial<AttendanceSettings>
): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(settings)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (
  settings: AttendanceSettingsData
): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert([settings])
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
