
import { supabase } from '@/integrations/supabase/client';

export interface Attendance {
  attendanceid?: number;
  employeeid: number;
  attendancedate?: string;
  status: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  customerid?: number;
  selfieimagepath?: string;
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
      .select();

    if (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }

    // Fix: Changed from single() to ensuring we get the first entry from the array
    return (data && data[0]) as Attendance;
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
      .select();

    if (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }

    // Fix: Changed from single() to ensuring we get the first entry from the array
    return (data && data[0]) as Attendance;
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
