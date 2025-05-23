
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  attendancesettingid?: string;
  employee_id: string; // Match database column name
  customerid: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

export const getAttendanceSettings = async (employeeId: string): Promise<AttendanceSettings[] | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }
    
    // Convert the latethreshold to string to match our interface
    const typedData = data?.map(item => ({
      ...item,
      latethreshold: item.latethreshold ? String(item.latethreshold) : undefined
    }));
    
    return typedData as AttendanceSettings[];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (id: string, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(settings)
      .eq('attendancesettingid', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }
    
    // Convert the latethreshold to string
    return {
      ...data,
      latethreshold: data.latethreshold ? String(data.latethreshold) : undefined
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, 'attendancesettingid'>): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(settings)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }
    
    // Convert the latethreshold to string
    return {
      ...data,
      latethreshold: data.latethreshold ? String(data.latethreshold) : undefined
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
