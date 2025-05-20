
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

    // Map database fields to interface, ensuring the correct types
    const settings = data.map(item => ({
      id: item.attendancesettingid,
      attendancesettingid: item.attendancesettingid,
      employeeid: item.employee_id || '', // Use employee_id field for consistency
      employee_id: item.employee_id,
      customerid: item.customerid,
      workstarttime: item.workstarttime || '09:00:00',
      latethreshold: String(item.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: item.geofencingenabled || false,
      photoverificationenabled: item.photoverificationenabled || false,
    }));

    return settings;
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
      latethreshold: String(data.latethreshold), // Ensure string type
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
    // Format settings to match database schema with correct types
    const settingsToInsert = {
      employee_id: settings.employee_id || settings.employeeid,
      customerid: settings.customerid || '', // Provide default value
      workstarttime: settings.workstarttime || '09:00:00',
      latethreshold: settings.latethreshold || '00:15:00', // Ensure string format
      geofencingenabled: settings.geofencingenabled || false,
      photoverificationenabled: settings.photoverificationenabled || false
    };
    
    const { data: newSettings, error: createError } = await supabase
      .from('attendancesettings')
      .insert(settingsToInsert)
      .select()
      .single();

    if (createError) {
      console.error("Error creating attendance settings:", createError);
      throw createError;
    }

    return {
      id: String(newSettings.attendancesettingid),
      attendancesettingid: String(newSettings.attendancesettingid),
      employeeid: String(newSettings.employee_id),
      employee_id: String(newSettings.employee_id),
      customerid: String(newSettings.customerid),
      workstarttime: newSettings.workstarttime,
      latethreshold: String(newSettings.latethreshold), // Ensure string type
      geofencingenabled: newSettings.geofencingenabled,
      photoverificationenabled: newSettings.photoverificationenabled
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
      latethreshold: String(data.latethreshold), // Ensure string type
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
    // Ensure all required fields are present and of the correct type
    if (!settings.customerid || !settings.employee_id) {
      throw new Error("Customer ID and Employee ID are required for upsert operation");
    }
    
    // Format settings to match database schema
    const settingsToUpsert = {
      attendancesettingid: settings.attendancesettingid,
      employee_id: settings.employee_id || settings.employeeid,
      customerid: settings.customerid,
      workstarttime: settings.workstarttime || '09:00:00',
      latethreshold: settings.latethreshold || '00:15:00',
      geofencingenabled: settings.geofencingenabled ?? false,
      photoverificationenabled: settings.photoverificationenabled ?? false
    };
    
    // Remove properties that shouldn't be sent to the database
    delete (settingsToUpsert as any).employeeid;
    delete (settingsToUpsert as any).id;
    
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
      latethreshold: String(data.latethreshold), // Ensure string type
      geofencingenabled: data.geofencingenabled,
      photoverificationenabled: data.photoverificationenabled
    };
  } catch (error) {
    console.error("Error in upsertAttendanceSettings:", error);
    throw error;
  }
};
