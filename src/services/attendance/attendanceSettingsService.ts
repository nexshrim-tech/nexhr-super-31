
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
    
    // Ensure all required properties are present in the cleanSettings
    // This is important for TypeScript type checking
    if (!('geofencingenabled' in cleanSettings)) {
      cleanSettings.geofencingenabled = false;
    }
    
    if (!('latethreshold' in cleanSettings)) {
      cleanSettings.latethreshold = '15';
    }
    
    if (!('photoverificationenabled' in cleanSettings)) {
      cleanSettings.photoverificationenabled = false;
    }
    
    if (!('workstarttime' in cleanSettings)) {
      cleanSettings.workstarttime = '09:00:00';
    }
    
    // Create a properly typed object to satisfy TypeScript
    const typedSettings: AttendanceSettingsData = {
      employeeid: cleanSettings.employeeid,
      geofencingenabled: Boolean(cleanSettings.geofencingenabled),
      latethreshold: String(cleanSettings.latethreshold),
      photoverificationenabled: Boolean(cleanSettings.photoverificationenabled),
      workstarttime: String(cleanSettings.workstarttime),
      ...(cleanSettings.workendtime ? { workendtime: String(cleanSettings.workendtime) } : {})
    };
    
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
