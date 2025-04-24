// This file provides service functions for managing attendance data
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  firstname: string;
  lastname: string;
}

export interface Attendance {
  id?: string;
  employeeid?: number;
  customerid?: number;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  status?: string;
  selfieimagepath?: string;
  employee?: Employee;
  notes?: string;
}

// Define how data is structured in the database vs. our interface
interface AttendanceDB {
  attendanceid?: string; // Adding this field for mapping
  employeeid: number;
  customerid: number;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  status: string | null;
  selfieimagepath: string | null;
  notes?: string | null;
}

// Set up a different return type for this query that doesn't use deepmerge to avoid infinite recursion
type AttendanceWithEmployee = {
  checkintimestamp: string;
  checkouttimestamp: string;
  customerid: number;
  employeeid: number;
  selfieimagepath: string;
  status: string;
  attendanceid?: string;
  notes?: string;
  employee: {
    firstname: string;
    lastname: string;
  };
};

export const getAttendanceRecords = async (customerId?: number): Promise<Attendance[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `);
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
    
    // Map database response to our interface
    return (data || []).map((item: AttendanceWithEmployee) => ({
      id: item.attendanceid,
      employeeid: item.employeeid,
      customerid: item.customerid,
      checkintimestamp: item.checkintimestamp,
      checkouttimestamp: item.checkouttimestamp,
      status: item.status,
      selfieimagepath: item.selfieimagepath,
      employee: item.employee,
      notes: item.notes
    }));
  } catch (error) {
    console.error('Error in getAttendanceRecords:', error);
    throw error;
  }
};

// Other functions for attendance management
export const markAttendance = async (data: Attendance): Promise<Attendance> => {
  try {
    const attendanceData = {
      employeeid: data.employeeid,
      customerid: data.customerid,
      checkintimestamp: data.checkintimestamp || new Date().toISOString(),
      status: data.status || 'Present',
      selfieimagepath: data.selfieimagepath,
      notes: data.notes
    };
    
    const { data: attendance, error } = await supabase
      .from('attendance')
      .insert([attendanceData])
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .single();
    
    if (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
    
    const result = attendance as unknown as AttendanceWithEmployee;
    
    return {
      id: result.attendanceid,
      employeeid: result.employeeid,
      customerid: result.customerid,
      checkintimestamp: result.checkintimestamp,
      checkouttimestamp: result.checkouttimestamp,
      status: result.status,
      selfieimagepath: result.selfieimagepath,
      employee: result.employee,
      notes: result.notes
    };
  } catch (error) {
    console.error('Error in markAttendance:', error);
    throw error;
  }
};

export const updateAttendance = async (id: string, data: Partial<Attendance>): Promise<Attendance> => {
  try {
    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    
    const { data: attendance, error } = await supabase
      .from('attendance')
      .update(cleanData)
      .eq('attendanceid', id)
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
    
    const result = attendance as unknown as AttendanceWithEmployee;
    
    return {
      id: result.attendanceid,
      employeeid: result.employeeid,
      customerid: result.customerid,
      checkintimestamp: result.checkintimestamp,
      checkouttimestamp: result.checkouttimestamp,
      status: result.status,
      selfieimagepath: result.selfieimagepath,
      employee: result.employee,
      notes: result.notes
    };
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    throw error;
  }
};
