
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceSettings {
  id?: string;
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
export const getAttendanceSettings = async (employeeId?: string): Promise<AttendanceSettings[]> => {
  try {
    let query = supabase.from('attendancesettings').select('*');
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching attendance settings:", error);
      throw error;
    }

    // Map database fields to interface
    return (data || []).map(item => ({
      id: String(item.attendancesettingid),
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
      id: String(data.attendancesettingid),
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

// Create attendance settings
export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, "attendancesettingid">): Promise<AttendanceSettings> => {
  try {
    // Format settings to match database schema
    const settingsToInsert = {
      employee_id: settings.employee_id || settings.employeeid,
      customerid: settings.customerid,
      workstarttime: settings.workstarttime,
      latethreshold: settings.latethreshold,
      geofencingenabled: settings.geofencingenabled,
      photoverificationenabled: settings.photoverificationenabled
    };
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(settingsToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating attendance settings:", error);
      throw error;
    }

    return {
      id: String(data.attendancesettingid),
      attendancesettingid: String(data.attendancesettingid),
      employeeid: String(data.employee_id),
      employee_id: String(data.employee_id),
      customerid: String(data.customerid),
      workstarttime: data.workstarttime,
      latethreshold: data.latethreshold,
      geofencingenabled: data.geofencingenabled,
      photoverificationenabled: data.photoverificationenabled
    };
  } catch (error) {
    console.error("Error in createAttendanceSettings:", error);
    throw error;
  }
};

// Update attendance settings
export const updateAttendanceSettings = async (id: string, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    // Create a copy of settings to avoid modifying the input object
    const settingsToUpdate = { ...settings };
    
    // Map employeeid to employee_id if it exists
    if (settingsToUpdate.employeeid && !settingsToUpdate.employee_id) {
      settingsToUpdate.employee_id = settingsToUpdate.employeeid;
    }
    
    // Remove properties that shouldn't be sent to the database
    delete settingsToUpdate.employeeid;
    delete settingsToUpdate.id; 
    delete settingsToUpdate.attendancesettingid;

    const { data, error } = await supabase
      .from('attendancesettings')
      .update(settingsToUpdate)
      .eq('attendancesettingid', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating attendance settings:", error);
      throw error;
    }

    return {
      id: String(data.attendancesettingid),
      attendancesettingid: String(data.attendancesettingid),
      employeeid: String(data.employee_id),
      employee_id: String(data.employee_id),
      customerid: String(data.customerid),
      workstarttime: data.workstarttime,
      latethreshold: data.latethreshold,
      geofencingenabled: data.geofencingenabled,
      photoverificationenabled: data.photoverificationenabled
    };
  } catch (error) {
    console.error("Error in updateAttendanceSettings:", error);
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

// Upsert attendance settings
export const upsertAttendanceSettings = async (settings: AttendanceSettings): Promise<AttendanceSettings> => {
  try {
    // Format settings to match database schema
    const settingsToUpsert = {
      ...settings,
      employee_id: settings.employee_id || settings.employeeid
    };
    
    // Remove properties that shouldn't be sent to the database
    delete settingsToUpsert.employeeid;
    delete settingsToUpsert.id;
    
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
      id: String(data.attendancesettingid),
      attendancesettingid: String(data.attendancesettingid),
      employeeid: String(data.employee_id),
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
