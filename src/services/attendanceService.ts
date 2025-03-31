
import { supabase } from '@/integrations/supabase/client';

export interface Attendance {
  id?: number;
  employeeid?: number;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  status?: string;
  selfieimagepath?: string;
  customerid?: number;
}

export interface AttendanceSettings {
  attendancesettingid?: number;
  customerid?: number;
  employeeid?: number;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

export const getAttendanceRecords = async (customerId?: number, employeeId?: number): Promise<Attendance[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    const { data, error } = await query.order('checkintimestamp', { ascending: false });

    if (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAttendanceRecords:', error);
    throw error;
  }
};

export const markAttendance = async (attendance: Attendance): Promise<Attendance> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendance])
      .select()
      .single();

    if (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in markAttendance:', error);
    throw error;
  }
};

export const updateAttendance = async (id: number, attendance: Partial<Attendance>): Promise<Attendance> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .update(attendance)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    throw error;
  }
};

export const getAttendanceSettings = async (customerId?: number, employeeId?: number): Promise<AttendanceSettings | null> => {
  try {
    let query = supabase
      .from('attendancesettings')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: Omit<Partial<AttendanceSettings>, 'attendancesettingid'>
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

    return data;
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

    return data;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};
