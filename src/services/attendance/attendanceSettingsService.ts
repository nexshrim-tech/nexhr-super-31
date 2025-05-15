
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceSettings {
  attendancesettingid?: string;
  employeeid?: string;
  employee_id?: string;
  customerid?: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

// Get all attendance settings
export const getAttendanceSettings = async (): Promise<AttendanceSettings[]> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*');

    if (error) {
      console.error("Error fetching attendance settings:", error);
      throw error;
    }

    // Map database fields to interface
    return (data || []).map(item => ({
      attendancesettingid: String(item.attendancesettingid),
      employeeid: String(item.employee_id), // Map to employeeid for backward compatibility
      employee_id: String(item.employee_id),
      customerid: String(item.customerid),
      workstarttime: item.workstarttime,
      latethreshold: item.latethreshold,
      geofencingenabled: item.geofencingenabled,
      photoverificationenabled: item.photoverificationenabled
    }));
  } catch (error) {
    console.error("Error in getAttendanceSettings:", error);
    throw error;
  }
};

// Get attendance settings for a specific employee
export const getEmployeeAttendanceSettings = async (employeeId: string): Promise<AttendanceSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error) {
      // If settings don't exist for this employee, return null instead of throwing
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Error fetching employee attendance settings:", error);
      throw error;
    }

    return {
      attendancesettingid: String(data.attendancesettingid),
      employeeid: String(data.employee_id), // Map to employeeid for backward compatibility
      employee_id: String(data.employee_id),
      customerid: String(data.customerid),
      workstarttime: data.workstarttime,
      latethreshold: data.latethreshold,
      geofencingenabled: data.geofencingenabled,
      photoverificationenabled: data.photoverificationenabled
    };
  } catch (error) {
    console.error("Error in getEmployeeAttendanceSettings:", error);
    throw error;
  }
};

// Create or update attendance settings
export const upsertAttendanceSettings = async (settings: AttendanceSettings): Promise<AttendanceSettings> => {
  try {
    // Make sure to map employeeid to employee_id if it exists
    const settingsToUpsert = {
      ...settings,
      employee_id: settings.employee_id || settings.employeeid
    };
    
    // Remove employeeid to prevent Supabase from trying to insert it
    delete settingsToUpsert.employeeid;
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .upsert(settingsToUpsert)
      .select()
      .single();

    if (error) {
      console.error("Error upserting attendance settings:", error);
      throw error;
    }

    return {
      attendancesettingid: String(data.attendancesettingid),
      employeeid: String(data.employee_id), // Map to employeeid for backward compatibility
      employee_id: String(data.employee_id),
      customerid: String(data.customerid),
      workstarttime: data.workstarttime,
      latethreshold: data.latethreshold,
      geofencingenabled: data.geofencingenabled,
      photoverificationenabled: data.photoverificationenabled
    };
  } catch (error) {
    console.error("Error in upsertAttendanceSettings:", error);
    throw error;
  }
};

// Delete attendance settings
export const deleteAttendanceSettings = async (settingId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendancesettings')
      .delete()
      .eq('attendancesettingid', settingId);

    if (error) {
      console.error("Error deleting attendance settings:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteAttendanceSettings:", error);
    throw error;
  }
};
