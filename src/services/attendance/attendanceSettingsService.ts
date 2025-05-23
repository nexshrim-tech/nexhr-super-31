
import { supabase } from '@/integrations/supabase/client';
import { AttendanceSettings } from '@/types/attendance';

export const getAttendanceSettings = async (employeeId: string): Promise<AttendanceSettings[]> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      attendancesettingid: item.attendancesettingid,
      employee_id: item.employee_id,
      customerid: item.customerid,
      workstarttime: item.workstarttime || undefined,
      latethreshold: item.latethreshold ? String(item.latethreshold) : undefined,
      geofencingenabled: item.geofencingenabled || false,
      photoverificationenabled: item.photoverificationenabled || false
    })) as AttendanceSettings[];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (id: string, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .update({
        workstarttime: settings.workstarttime,
        latethreshold: settings.latethreshold,
        geofencingenabled: settings.geofencingenabled,
        photoverificationenabled: settings.photoverificationenabled
      })
      .eq('attendancesettingid', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }
    
    return {
      attendancesettingid: data.attendancesettingid,
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || undefined,
      latethreshold: data.latethreshold ? String(data.latethreshold) : undefined,
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, 'attendancesettingid'>): Promise<AttendanceSettings> => {
  try {
    if (!settings.employee_id || !settings.customerid) {
      throw new Error('Missing required fields for attendance settings');
    }
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert({
        employee_id: settings.employee_id,
        customerid: settings.customerid,
        workstarttime: settings.workstarttime,
        latethreshold: settings.latethreshold,
        geofencingenabled: settings.geofencingenabled,
        photoverificationenabled: settings.photoverificationenabled
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }
    
    return {
      attendancesettingid: data.attendancesettingid,
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || undefined,
      latethreshold: data.latethreshold ? String(data.latethreshold) : undefined,
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
