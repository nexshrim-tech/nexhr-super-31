
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface EmployeeBasic {
  firstname: string;
  lastname: string;
  salary?: {
    basicsalary: number;
  };
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

export interface AttendanceUpdateData {
  status?: string;
  notes?: string;
  checkintime?: string;
  checkouttime?: string;
  date?: string;
}

// Helper function to check if an object is a Supabase error
const isSupabaseError = (obj: any): boolean => {
  return obj && typeof obj === 'object' && 'error' in obj;
};

export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname,
          salary:salary (
            basicsalary
          )
        )
      `);

    if (error) {
      console.error('Error fetching attendance records:', error);
      return [];
    }

    // Process the data to ensure it matches AttendanceRecord type
    const processedData: AttendanceRecord[] = data?.map(record => {
      const attendanceRecord: AttendanceRecord = {
        checkintimestamp: record.checkintimestamp || '',
        checkouttimestamp: record.checkouttimestamp || '',
        customerid: record.customerid || 0,
        employeeid: record.employeeid || 0,
        selfieimagepath: record.selfieimagepath || '',
        status: record.status || '',
      };
      
      // Only add attendanceid if it exists
      if ('attendanceid' in record && record.attendanceid !== null) {
        attendanceRecord.attendanceid = record.attendanceid;
      }
      
      // Only add notes if they exist
      if ('notes' in record && record.notes !== null) {
        attendanceRecord.notes = record.notes;
      }
      
      // Safely add employee information if it exists
      if (record.employee) {
        attendanceRecord.employee = {
          firstname: record.employee.firstname || '',
          lastname: record.employee.lastname || '',
        };
        
        // Safely add salary information, making sure it's not an error object
        if (record.employee.salary && 
            !isSupabaseError(record.employee.salary) && 
            typeof record.employee.salary === 'object' && 
            'basicsalary' in record.employee.salary) {
          attendanceRecord.employee.salary = {
            basicsalary: record.employee.salary.basicsalary || 0
          };
        }
      }
      
      return attendanceRecord;
    }) || [];

    return processedData;
  } catch (error) {
    console.error('Error in getAllAttendanceRecords:', error);
    return [];
  }
};

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
          lastname,
          salary:salary (
            basicsalary
          )
        )
      `)
      .gte('checkintimestamp', startOfDay)
      .lte('checkintimestamp', endOfDay);

    if (error) {
      console.error('Error fetching attendance for date:', error);
      return [];
    }

    const recordsWithDate: AttendanceRecord[] = [];
    
    if (data && Array.isArray(data)) {
      for (const record of data) {
        // Create a properly typed attendance record with safe access to properties
        const attendanceRecord: AttendanceRecord = {
          // Required properties with fallbacks
          checkintimestamp: record.checkintimestamp || '',
          checkouttimestamp: record.checkouttimestamp || '',
          customerid: record.customerid || 0,
          employeeid: record.employeeid || 0,
          selfieimagepath: record.selfieimagepath || '',
          status: record.status || '',
          
          // Optional properties
          date: formattedDate,
          checkintime: record.checkintimestamp ? format(parseISO(record.checkintimestamp), 'HH:mm') : '',
          checkouttime: record.checkouttimestamp ? format(parseISO(record.checkouttimestamp), 'HH:mm') : '',
          workhours: '',
        };
        
        // Safely add optional properties only if they exist in the record
        if ('attendanceid' in record && typeof record.attendanceid === 'number') {
          attendanceRecord.attendanceid = record.attendanceid;
        }
        
        if ('notes' in record && typeof record.notes === 'string') {
          attendanceRecord.notes = record.notes;
        }
        
        // Safely add employee information if it exists
        if (record.employee) {
          attendanceRecord.employee = {
            firstname: record.employee.firstname || '',
            lastname: record.employee.lastname || '',
          };
          
          // Safely handle the salary object
          const employeeSalary = record.employee.salary;
          if (employeeSalary && 
              !isSupabaseError(employeeSalary) && 
              typeof employeeSalary === 'object' && 
              'basicsalary' in employeeSalary) {
            attendanceRecord.employee.salary = {
              basicsalary: employeeSalary.basicsalary || 0
            };
          }
        }
        
        recordsWithDate.push(attendanceRecord);
      }
    }

    return recordsWithDate;
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

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
