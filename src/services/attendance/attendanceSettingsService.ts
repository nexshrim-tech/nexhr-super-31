
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  attendancesettingid?: string;
  employee_id: string; // Match the database column name
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
    
    return data as AttendanceSettings[];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (id: string, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    // Remove the attendancesettingid if it exists in settings to avoid type error
    const { attendancesettingid, ...updateData } = settings;
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(updateData)
      .eq('attendancesettingid', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }
    
    return data as AttendanceSettings;
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
    
    return data as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
