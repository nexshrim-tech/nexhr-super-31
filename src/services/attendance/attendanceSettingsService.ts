
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

    // Map database fields to interface fields
    return (data || []).map(item => ({
      id: item.attendancesettingid,
      employeeid: item.employeeid,
      geofencingenabled: item.geofencingenabled || false,
      latethreshold: String(item.latethreshold || '15'),
      photoverificationenabled: item.photoverificationenabled || false,
      workstarttime: item.workstarttime || '09:00',
      workendtime: item.workendtime,
      created_at: item.created_at
    }));
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
    
    // Map interface fields to database fields
    const dbSettings: Record<string, any> = {};
    if ('geofencingenabled' in cleanSettings) dbSettings.geofencingenabled = cleanSettings.geofencingenabled;
    if ('latethreshold' in cleanSettings) dbSettings.latethreshold = cleanSettings.latethreshold;
    if ('photoverificationenabled' in cleanSettings) dbSettings.photoverificationenabled = cleanSettings.photoverificationenabled;
    if ('workstarttime' in cleanSettings) dbSettings.workstarttime = cleanSettings.workstarttime;
    if ('workendtime' in cleanSettings) dbSettings.workendtime = cleanSettings.workendtime;
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(dbSettings)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }

    // Map database response to interface
    return {
      id: data.attendancesettingid,
      employeeid: data.employeeid,
      geofencingenabled: data.geofencingenabled || false,
      latethreshold: String(data.latethreshold || '15'),
      photoverificationenabled: data.photoverificationenabled || false,
      workstarttime: data.workstarttime || '09:00',
      workendtime: data.workendtime
    };
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
    
    // Map interface fields to database fields
    const dbSettings: Record<string, any> = {
      employeeid: cleanSettings.employeeid,
      geofencingenabled: Boolean(cleanSettings.geofencingenabled),
      latethreshold: String(cleanSettings.latethreshold || '15'),
      photoverificationenabled: Boolean(cleanSettings.photoverificationenabled),
      workstarttime: String(cleanSettings.workstarttime || '09:00')
    };
    
    if (cleanSettings.workendtime) {
      dbSettings.workendtime = String(cleanSettings.workendtime);
    }
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(dbSettings)
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }

    // Map database response to interface
    return {
      id: data.attendancesettingid,
      employeeid: data.employeeid,
      geofencingenabled: data.geofencingenabled || false,
      latethreshold: String(data.latethreshold || '15'),
      photoverificationenabled: data.photoverificationenabled || false,
      workstarttime: data.workstarttime || '09:00',
      workendtime: data.workendtime
    };
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
