
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  id?: number;
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
    const query = supabase
      .from('attendancesettings')
      .select('*');
    
    const finalQuery = employeeId 
      ? query.eq('employeeid', employeeId)
      : query;
    
    const { data, error } = await finalQuery;

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
    // Clean up undefined values
    const cleanSettings = Object.fromEntries(
      Object.entries(settings).filter(([_, value]) => value !== undefined)
    );
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(cleanSettings)
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
    // Clean up undefined values
    const cleanSettings = Object.fromEntries(
      Object.entries(settings).filter(([_, value]) => value !== undefined)
    );
    
    // Ensure employeeid is properly handled
    if (cleanSettings.employeeid && typeof cleanSettings.employeeid === 'string') {
      cleanSettings.employeeid = parseInt(cleanSettings.employeeid, 10);
    }
    
    // Make sure we're passing a properly typed object
    const typedSettings: {
      employeeid?: number;
      geofencingenabled: boolean;
      latethreshold: string;
      photoverificationenabled: boolean;
      workstarttime: string;
      workendtime?: string;
      [key: string]: any;
    } = cleanSettings;
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(typedSettings)
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
