
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  attendancesettingid?: number;
  customerid?: number;
  employeeid?: number;
  geofencingenabled: boolean;
  latethreshold: string;  // Using string type for latethreshold
  photoverificationenabled: boolean;
  workstarttime: string;
}

export const getAttendanceSettings = async (employeeId?: number): Promise<AttendanceSettings[]> => {
  try {
    let query = supabase
      .from('attendancesettings')
      .select('*');
    
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }

    // Transform latethreshold from unknown to string if needed
    const formattedData = data?.map(item => ({
      ...item,
      latethreshold: String(item.latethreshold) // Ensure latethreshold is a string
    })) || [];

    return formattedData;
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: Partial<Omit<AttendanceSettings, 'attendancesettingid'>>
): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(settings)
      .eq('attendancesettingid', id)
      .select();

    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after update');
    }

    return {
      ...data[0],
      latethreshold: String(data[0].latethreshold)
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>
): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert([settings])
      .select();

    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after creation');
    }

    return {
      ...data[0],
      latethreshold: String(data[0].latethreshold)
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};

export const bulkCreateAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>[]
): Promise<AttendanceSettings[]> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(settings)
      .select();

    if (error) {
      console.error('Error bulk creating attendance settings:', error);
      throw error;
    }

    // Transform latethreshold from unknown to string if needed
    const formattedData = data?.map(item => ({
      ...item,
      latethreshold: String(item.latethreshold) // Ensure latethreshold is a string
    })) || [];

    return formattedData;
  } catch (error) {
    console.error('Error in bulkCreateAttendanceSettings:', error);
    throw error;
  }
};
