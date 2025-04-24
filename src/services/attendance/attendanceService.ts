
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface EmployeeBasic {
  firstname: string;
  lastname: string;
}

export interface AttendanceRecord {
  attendanceid?: number;
  checkintimestamp: string;
  checkouttimestamp: string;
  customerid: number;
  employeeid: number;
  selfieimagepath: string;
  status: string;
  employee?: EmployeeBasic;
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  workhours?: string;
  notes?: string;
}

// Interface for update attendance record data
export interface AttendanceUpdateData {
  status?: string;
  notes?: string;
  checkintime?: string;
  checkouttime?: string;
  date?: string;
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

// Updated getAttendanceForDate function to accept Date or string
export const getAttendanceForDate = async (date: Date | string): Promise<AttendanceRecord[]> => {
  try {
    const formattedDate = typeof date === 'string' 
      ? format(parseISO(date), 'yyyy-MM-dd')
      : format(date, 'yyyy-MM-dd');
    
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

    // Fix the deep type instantiation by creating explicit typed objects
    const recordsWithDate: AttendanceRecord[] = [];
    
    if (data && Array.isArray(data)) {
      for (const record of data) {
        recordsWithDate.push({
          attendanceid: record.attendanceid,
          checkintimestamp: record.checkintimestamp,
          checkouttimestamp: record.checkouttimestamp,
          customerid: record.customerid,
          employeeid: record.employeeid,
          selfieimagepath: record.selfieimagepath || '',
          status: record.status || '',
          employee: record.employee ? {
            firstname: record.employee.firstname,
            lastname: record.employee.lastname
          } : undefined,
          date: formattedDate,
          checkintime: record.checkintimestamp ? format(parseISO(record.checkintimestamp), 'HH:mm') : '',
          checkouttime: record.checkouttimestamp ? format(parseISO(record.checkouttimestamp), 'HH:mm') : '',
          workhours: record.workhours || ''
        });
      }
    }

    return recordsWithDate;
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

// Add updateAttendanceRecord function
export const updateAttendanceRecord = async (
  attendanceId: number, 
  updateData: AttendanceUpdateData
): Promise<AttendanceRecord | null> => {
  try {
    const updatedData: Record<string, any> = { ...updateData };
    
    if (updateData.date && updateData.checkintime) {
      updatedData.checkintimestamp = `${updateData.date}T${updateData.checkintime}:00`;
      delete updatedData.checkintime;
    }
    
    if (updateData.date && updateData.checkouttime) {
      updatedData.checkouttimestamp = `${updateData.date}T${updateData.checkouttime}:00`;
      delete updatedData.checkouttime;
    }
    
    delete updatedData.date;
    
    console.log('Updating attendance with data:', updatedData);
    
    const { data, error } = await supabase
      .from('attendance')
      .update(updatedData)
      .eq('attendanceid', attendanceId)
      .select();
    
    if (error) {
      console.error('Error updating attendance record:', error);
      return null;
    }
    
    return data?.[0] as AttendanceRecord || null;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    return null;
  }
};
