
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceSettings {
  id?: string;
  attendancesettingid?: string;
  employee_id: string;  // Changed from employeeid to match DB schema
  customerid: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

/**
 * Fetches attendance settings for an employee
 */
export const getAttendanceSettings = async (employeeId: string): Promise<AttendanceSettings[] | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employee_id', employeeId);
      
    if (error) {
      console.error("Error fetching attendance settings:", error);
      throw error;
    }
    
    return data as AttendanceSettings[];
  } catch (error) {
    console.error("Error in getAttendanceSettings:", error);
    return null;
  }
};

/**
 * Updates attendance settings
 */
export const updateAttendanceSettings = async (id: string, settings: Partial<AttendanceSettings>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendancesettings')
      .update(settings)
      .eq('attendancesettingid', id);
      
    if (error) {
      console.error("Error updating attendance settings:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateAttendanceSettings:", error);
    throw error;
  }
};

/**
 * Gets attendance settings by ID
 */
export const getAttendanceSettingById = async (id: string): Promise<AttendanceSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('attendancesettingid', id)
      .single();
      
    if (error) {
      console.error("Error fetching attendance setting by ID:", error);
      throw error;
    }
    
    return data as AttendanceSettings;
  } catch (error) {
    console.error("Error in getAttendanceSettingById:", error);
    return null;
  }
};

/**
 * Creates new attendance settings
 */
export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, 'attendancesettingid' | 'id'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendancesettings')
      .insert({
        employee_id: settings.employee_id,
        customerid: settings.customerid,
        workstarttime: settings.workstarttime,
        latethreshold: settings.latethreshold,
        geofencingenabled: settings.geofencingenabled,
        photoverificationenabled: settings.photoverificationenabled
      });
      
    if (error) {
      console.error("Error creating attendance settings:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createAttendanceSettings:", error);
    throw error;
  }
};

export * from './attendanceService';
