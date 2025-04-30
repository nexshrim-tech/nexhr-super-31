
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  id?: number;
  attendancesettingid?: number;
  employeeid: number;
  customerid?: number;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

export const getAttendanceSettings = async (employeeId: number): Promise<AttendanceSettings[] | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employeeid', employeeId);
    
    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (id: number, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
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
    
    return data;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, 'id' | 'attendancesettingid'>): Promise<AttendanceSettings> => {
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
    
    return data;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
