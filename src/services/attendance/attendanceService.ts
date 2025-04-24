// Fix the recursive type definition by defining proper interfaces
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface EmployeeBasic {
  firstname: string;
  lastname: string;
}

export interface AttendanceRecord {
  checkintimestamp: string;
  checkouttimestamp: string;
  customerid: number;
  employeeid: number;
  selfieimagepath: string;
  status: string;
  employee?: EmployeeBasic; // Make employee optional to avoid type errors
}

// Get all attendance records with optional employee details
export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `);

    if (error) {
      console.error('Error fetching attendance records:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllAttendanceRecords:', error);
    return [];
  }
};

// Fixed getAttendanceForDate function
export const getAttendanceForDate = async (date: Date): Promise<AttendanceRecord[]> => {
  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Get start and end of the day in ISO format
    const startOfDay = `${formattedDate}T00:00:00`;
    const endOfDay = `${formattedDate}T23:59:59`;
    
    console.log(`Fetching attendance between ${startOfDay} and ${endOfDay}`);
    
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .gte('checkintimestamp', startOfDay)
      .lte('checkintimestamp', endOfDay);

    if (error) {
      console.error('Error fetching attendance for date:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

// Rest of the attendance service functions
// ... keep existing code
