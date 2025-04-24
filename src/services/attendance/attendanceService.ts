
// This file provides service functions for managing attendance data
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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

// Export AttendanceRecord type for components to use
export interface AttendanceRecord {
  attendanceid?: number;
  employeeid: number;
  customerid: number;
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  status?: string;
  selfieimagepath?: string;
  workhours?: number;
  notes?: string;
  employee?: {
    firstname: string;
    lastname: string;
  };
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

// Use a simpler type to avoid excessive type instantiation
type AttendanceWithEmployee = {
  attendanceid?: string;
  employeeid: number;
  customerid: number;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  status: string | null;
  selfieimagepath: string | null;
  notes?: string | null;
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

// Add the getAttendanceForDate function that components are looking for
export const getAttendanceForDate = async (dateString: string): Promise<AttendanceRecord[]> => {
  try {
    // Format date for comparing with timestamps in database (YYYY-MM-DD)
    const formattedDate = dateString;
    
    // Query attendance records for the specific date
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        attendanceid,
        employeeid,
        customerid,
        checkintimestamp,
        checkouttimestamp,
        status,
        selfieimagepath,
        notes,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .gte('checkintimestamp', `${formattedDate}T00:00:00`)
      .lt('checkintimestamp', `${formattedDate}T23:59:59`);
    
    if (error) {
      console.error('Error fetching attendance records for date:', error);
      throw error;
    }
    
    // Calculate work hours and transform data
    return (data || []).map((item: any) => {
      let workhours = 0;
      
      // Calculate work hours if both check-in and check-out timestamps exist
      if (item.checkintimestamp && item.checkouttimestamp) {
        const checkin = new Date(item.checkintimestamp).getTime();
        const checkout = new Date(item.checkouttimestamp).getTime();
        workhours = Math.round((checkout - checkin) / (1000 * 60 * 60) * 10) / 10; // Round to 1 decimal place
      }
      
      return {
        attendanceid: item.attendanceid,
        employeeid: item.employeeid,
        customerid: item.customerid,
        date: formattedDate,
        checkintime: item.checkintimestamp ? format(new Date(item.checkintimestamp), 'HH:mm') : undefined,
        checkouttime: item.checkouttimestamp ? format(new Date(item.checkouttimestamp), 'HH:mm') : undefined,
        checkintimestamp: item.checkintimestamp,
        checkouttimestamp: item.checkouttimestamp,
        status: item.status,
        selfieimagepath: item.selfieimagepath,
        workhours: workhours > 0 ? workhours : undefined,
        notes: item.notes,
        employee: item.employee
      };
    });
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
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
        attendanceid,
        employeeid,
        customerid,
        checkintimestamp,
        checkouttimestamp,
        status,
        selfieimagepath,
        notes,
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
    
    // Use a simpler approach to type the result
    const result = attendance as any;
    
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
        attendanceid,
        employeeid,
        customerid,
        checkintimestamp,
        checkouttimestamp,
        status,
        selfieimagepath,
        notes,
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
    
    // Use a simpler approach to type the result
    const result = attendance as any;
    
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

// Add the updateAttendanceRecord function that components are looking for
export const updateAttendanceRecord = async (id: number, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
  try {
    // Convert from AttendanceRecord to database format
    const dbData: Partial<Record<string, any>> = {};
    
    if (data.checkintime) {
      const dateStr = data.date || format(new Date(), 'yyyy-MM-dd');
      dbData.checkintimestamp = `${dateStr}T${data.checkintime}:00`;
    }
    
    if (data.checkouttime) {
      const dateStr = data.date || format(new Date(), 'yyyy-MM-dd');
      dbData.checkouttimestamp = `${dateStr}T${data.checkouttime}:00`;
    }
    
    if (data.status) dbData.status = data.status;
    if (data.notes) dbData.notes = data.notes;
    
    // Update the record in the database
    const { data: attendance, error } = await supabase
      .from('attendance')
      .update(dbData)
      .eq('attendanceid', id)
      .select(`
        attendanceid,
        employeeid,
        customerid,
        checkintimestamp,
        checkouttimestamp,
        status,
        selfieimagepath,
        notes,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
    
    // Map database response to AttendanceRecord format
    const result = attendance as any;
    const formattedDate = result.checkintimestamp ? format(new Date(result.checkintimestamp), 'yyyy-MM-dd') : '';
    
    let workhours = 0;
    if (result.checkintimestamp && result.checkouttimestamp) {
      const checkin = new Date(result.checkintimestamp).getTime();
      const checkout = new Date(result.checkouttimestamp).getTime();
      workhours = Math.round((checkout - checkin) / (1000 * 60 * 60) * 10) / 10;
    }
    
    return {
      attendanceid: result.attendanceid,
      employeeid: result.employeeid,
      customerid: result.customerid,
      date: formattedDate,
      checkintime: result.checkintimestamp ? format(new Date(result.checkintimestamp), 'HH:mm') : undefined,
      checkouttime: result.checkouttimestamp ? format(new Date(result.checkouttimestamp), 'HH:mm') : undefined,
      checkintimestamp: result.checkintimestamp,
      checkouttimestamp: result.checkouttimestamp,
      status: result.status,
      selfieimagepath: result.selfieimagepath,
      workhours: workhours > 0 ? workhours : undefined,
      notes: result.notes,
      employee: result.employee
    };
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};
