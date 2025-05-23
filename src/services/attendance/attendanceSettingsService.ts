
import { supabase } from '@/integrations/supabase/client';
import { AttendanceSettings } from '@/types/attendance';

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
    })) as AttendanceSettings[];
    
    return typedData;
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
    // Make sure settings has the required fields
    if (!settings.employee_id || !settings.customerid) {
      throw new Error('Missing required fields for attendance settings');
    }
    
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
