
import { supabase } from '@/integrations/supabase/client';

export interface Attendance {
  attendanceid?: number;
  employeeid: number;
  attendancedate?: string;
  status: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  // Database schema fields
  checkintimestamp?: string;
  checkouttimestamp?: string;
  customerid?: number;
  selfieimagepath?: string;
}

export interface AttendanceSettings {
  attendancesettingid?: number;
  customerid?: number;
  employeeid?: number;
  geofencingenabled: boolean;
  latethreshold: string;  // Changed from unknown to string
  photoverificationenabled: boolean;
  workstarttime: string;
}

export const getAttendance = async (employeeId?: number, startDate?: string, endDate?: string): Promise<Attendance[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select('*');
    
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    if (startDate) {
      query = query.gte('checkintimestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('checkintimestamp', endDate);
    }
    
    const { data, error } = await query.order('checkintimestamp', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }

    return data as Attendance[] || [];
  } catch (error) {
    console.error('Error in getAttendance:', error);
    throw error;
  }
};

export const getAttendanceById = async (id: number): Promise<Attendance | null> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('attendanceid', id)
      .single();

    if (error) {
      console.error('Error fetching attendance by ID:', error);
      throw error;
    }

    return data as Attendance;
  } catch (error) {
    console.error('Error in getAttendanceById:', error);
    throw error;
  }
};

export const addAttendance = async (attendance: Omit<Attendance, 'attendanceid'>): Promise<Attendance> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendance])
      .select()
      .single();

    if (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }

    return data as Attendance;
  } catch (error) {
    console.error('Error in addAttendance:', error);
    throw error;
  }
};

export const updateAttendance = async (id: number, attendance: Partial<Omit<Attendance, 'attendanceid'>>): Promise<Attendance> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .update(attendance)
      .eq('attendanceid', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }

    return data as Attendance;
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    throw error;
  }
};

export const deleteAttendance = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('attendanceid', id);

    if (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAttendance:', error);
    throw error;
  }
};

export const getAttendanceSettings = async (employeeId?: number): Promise<AttendanceSettings[]> => {
  try {
    let query = supabase
      .from('attendancesettings')
      .select('*');
    
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }

    // Transform latethreshold from unknown to string if needed
    const formattedData = data?.map(item => ({
      ...item,
      latethreshold: String(item.latethreshold) // Ensure latethreshold is a string
    }));

    return formattedData as AttendanceSettings[] || [];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: Partial<Omit<AttendanceSettings, 'attendancesettingid'>>
): Promise<AttendanceSettings> => {
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

    return {
      ...data,
      latethreshold: String(data.latethreshold)
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>
): Promise<AttendanceSettings> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert([settings])
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance settings:', error);
      throw error;
    }

    return {
      ...data,
      latethreshold: String(data.latethreshold)
    } as AttendanceSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};

export const bulkCreateAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>[]
): Promise<AttendanceSettings[]> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .insert(settings)
      .select();

    if (error) {
      console.error('Error bulk creating attendance settings:', error);
      throw error;
    }

    // Transform latethreshold from unknown to string if needed
    const formattedData = data?.map(item => ({
      ...item,
      latethreshold: String(item.latethreshold) // Ensure latethreshold is a string
    }));

    return formattedData as AttendanceSettings[] || [];
  } catch (error) {
    console.error('Error in bulkCreateAttendanceSettings:', error);
    throw error;
  }
};
