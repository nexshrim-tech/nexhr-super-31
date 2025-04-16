
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  attendancesettingid?: number;
  customerid?: number;
  employeeid?: number;
  geofencingenabled: boolean;
  latethreshold: string;
  photoverificationenabled: boolean;
  workstarttime: string;
}

type AttendanceSettingsUpdate = Partial<Omit<AttendanceSettings, 'attendancesettingid'>>;

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

    return data as AttendanceSettings[] || [];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: AttendanceSettingsUpdate
): Promise<AttendanceSettings> => {
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

    if (!data) {
      throw new Error('No data returned after update');
    }

    return data as AttendanceSettings;
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
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after creation');
    }

    return data as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
