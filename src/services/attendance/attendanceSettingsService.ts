import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  id: string;
  attendancesettingid: string;
  employeeid?: string;
  employee_id: string;
  customerid: string;
  workstarttime: string;
  latethreshold: string; // Changed from unknown to string
  geofencingenabled: boolean;
  photoverificationenabled: boolean;
}

export const getAttendanceSettings = async (employeeId?: string): Promise<AttendanceSettings[]> => {
  try {
    let query = supabase
      .from('attendancesettings')
      .select('*');
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.attendancesettingid,
      attendancesettingid: item.attendancesettingid,
      employeeid: item.employee_id, // Map employee_id to employeeid for compatibility
      employee_id: item.employee_id,
      customerid: item.customerid,
      workstarttime: item.workstarttime || '09:00:00',
      latethreshold: String(item.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: item.geofencingenabled || false,
      photoverificationenabled: item.photoverificationenabled || false
    }));
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const getAttendanceSettingById = async (id: string): Promise<AttendanceSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('attendancesettingid', id)
      .single();

    if (error) {
      console.error('Error fetching attendance setting by ID:', error);
      throw error;
    }

    if (!data) return null;
    
    return {
      id: data.attendancesettingid,
      attendancesettingid: data.attendancesettingid,
      employeeid: data.employee_id, // Map employee_id to employeeid for compatibility
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || '09:00:00',
      latethreshold: String(data.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    };
  } catch (error) {
    console.error('Error in getAttendanceSettingById:', error);
    throw error;
  }
};

export const getAttendanceSettingByEmployeeId = async (employeeId: string): Promise<AttendanceSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching attendance settings by employee ID:', error);
      throw error;
    }

    if (!data) return null;
    
    return {
      id: data.attendancesettingid,
      attendancesettingid: data.attendancesettingid,
      employeeid: data.employee_id, // Map employee_id to employeeid for compatibility
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || '09:00:00',
      latethreshold: String(data.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    };
  } catch (error) {
    console.error('Error in getAttendanceSettingByEmployeeId:', error);
    throw error;
  }
};

export const addAttendanceSetting = async (settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    if (!settings.employee_id) {
      throw new Error('Employee ID is required');
    }

    if (!settings.customerid) {
      // Get the current auth user's ID to use as the customerid
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('You must be logged in to add attendance settings');
      }
      settings.customerid = userData.user.id;
    }
    
    // Create the database object with the required fields
    const dbSettings = {
      employee_id: settings.employee_id,
      customerid: settings.customerid,
      workstarttime: settings.workstarttime || '09:00:00',
      latethreshold: settings.latethreshold || '00:15:00',
      geofencingenabled: settings.geofencingenabled || false,
      photoverificationenabled: settings.photoverificationenabled || false
    };
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert([dbSettings])
      .select()
      .single();

    if (error) {
      console.error('Error adding attendance setting:', error);
      throw error;
    }

    return {
      id: data.attendancesettingid,
      attendancesettingid: data.attendancesettingid,
      employeeid: data.employee_id, // Map employee_id to employeeid for compatibility
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || '09:00:00',
      latethreshold: String(data.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    };
  } catch (error) {
    console.error('Error in addAttendanceSetting:', error);
    throw error;
  }
};

export const updateAttendanceSetting = async (id: string, settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  try {
    // Create the database object with only the fields that need updating
    const dbSettings: Record<string, any> = {};
    if (settings.employee_id) dbSettings.employee_id = settings.employee_id;
    if (settings.customerid) dbSettings.customerid = settings.customerid;
    if (settings.workstarttime) dbSettings.workstarttime = settings.workstarttime;
    if (settings.latethreshold) dbSettings.latethreshold = settings.latethreshold;
    if (typeof settings.geofencingenabled === 'boolean') {
      dbSettings.geofencingenabled = settings.geofencingenabled;
    }
    if (typeof settings.photoverificationenabled === 'boolean') {
      dbSettings.photoverificationenabled = settings.photoverificationenabled;
    }
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .update(dbSettings)
      .eq('attendancesettingid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance setting:', error);
      throw error;
    }

    return {
      id: data.attendancesettingid,
      attendancesettingid: data.attendancesettingid,
      employeeid: data.employee_id, // Map employee_id to employeeid for compatibility
      employee_id: data.employee_id,
      customerid: data.customerid,
      workstarttime: data.workstarttime || '09:00:00',
      latethreshold: String(data.latethreshold || '00:15:00'), // Convert to string
      geofencingenabled: data.geofencingenabled || false,
      photoverificationenabled: data.photoverificationenabled || false
    };
  } catch (error) {
    console.error('Error in updateAttendanceSetting:', error);
    throw error;
  }
};

export const deleteAttendanceSetting = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendancesettings')
      .delete()
      .eq('attendancesettingid', id);

    if (error) {
      console.error('Error deleting attendance setting:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAttendanceSetting:', error);
    throw error;
  }
};

export const createOrUpdateAttendanceSetting = async (settings: Partial<AttendanceSettings>): Promise<AttendanceSettings> => {
  if (!settings.employee_id) {
    throw new Error('Employee ID is required');
  }
  
  try {
    // Check if there's already a settings entry for this employee
    const existing = await getAttendanceSettingByEmployeeId(settings.employee_id);
    
    if (existing) {
      // Update existing settings
      return updateAttendanceSetting(existing.attendancesettingid, settings);
    } else {
      // Create new settings
      return addAttendanceSetting({
        ...settings,
        // Ensure required fields are present
        customerid: settings.customerid
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateAttendanceSetting:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (settings: {
  employee_id: string;
  id?: string;
  attendancesettingid?: string;
  employeeid?: string;
  customerid?: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}) => {
  try {
    // Make sure customerid is properly set if missing
    const settingsWithCustomerId = {
      ...settings,
      customerid: settings.customerid || ''
    };
    
    const { data, error } = await supabase
      .from('attendancesettings')
      .update({
        workstarttime: settingsWithCustomerId.workstarttime,
        latethreshold: settingsWithCustomerId.latethreshold,
        geofencingenabled: settingsWithCustomerId.geofencingenabled,
        photoverificationenabled: settingsWithCustomerId.photoverificationenabled
      })
      .eq('employee_id', settingsWithCustomerId.employee_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating attendance settings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (settings: {
  employee_id: string;
  customerid: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert({
        employee_id: settings.employee_id,
        customerid: settings.customerid,
        workstarttime: settings.workstarttime || '09:00',
        latethreshold: settings.latethreshold || '00:15:00',
        geofencingenabled: settings.geofencingenabled !== undefined ? settings.geofencingenabled : true,
        photoverificationenabled: settings.photoverificationenabled !== undefined ? settings.photoverificationenabled : false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating attendance settings:', error);
    throw error;
  }
};
