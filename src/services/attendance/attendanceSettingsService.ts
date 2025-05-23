
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  id?: number;
  attendancesettingid?: number;
  employeeid: number;
  customerid?: number;
  workstarttime?: string;
  latethreshold?: string; // Changed from unknown to string
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

export const updateAttendanceSettings = async (id: number, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
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
