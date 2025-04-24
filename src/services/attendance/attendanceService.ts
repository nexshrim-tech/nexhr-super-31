
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface EmployeeBasic {
  firstname: string;
  lastname: string;
  salary?: {
    basicsalary: number;
  } | null;
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

// Helper function to safely cast types
const safeNumber = (value: unknown, defaultValue: number = 0): number => {
  return (typeof value === 'number') ? value : defaultValue;
};

const safeString = (value: unknown, defaultValue: string = ''): string => {
  return (typeof value === 'string') ? value : defaultValue;
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
        checkintimestamp: safeString(record.checkintimestamp),
        checkouttimestamp: safeString(record.checkouttimestamp),
        customerid: safeNumber(record.customerid),
        employeeid: safeNumber(record.employeeid),
        selfieimagepath: safeString(record.selfieimagepath),
        status: safeString(record.status),
      };
      
      // Only add attendanceid if it exists
      if ('attendanceid' in record && record.attendanceid !== null) {
        attendanceRecord.attendanceid = safeNumber(record.attendanceid);
      }
      
      // Only add notes if they exist
      if ('notes' in record && record.notes !== null) {
        attendanceRecord.notes = safeString(record.notes);
      }
      
      // Safely add employee information if it exists
      if (record.employee) {
        attendanceRecord.employee = {
          firstname: safeString(record.employee.firstname),
          lastname: safeString(record.employee.lastname),
        };
        
        // Safely add salary information, making sure it's not null and not an error object
        // Fix: Add extra null check before accessing record.employee.salary
        if (record.employee.salary && 
            record.employee.salary !== null &&
            !isSupabaseError(record.employee.salary) && 
            typeof record.employee.salary === 'object') {
          // Explicitly check if basicsalary exists in the object
          if ('basicsalary' in record.employee.salary) {
            const salaryValue = record.employee.salary.basicsalary;
            attendanceRecord.employee.salary = {
              basicsalary: safeNumber(salaryValue)
            };
          }
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
          checkintimestamp: safeString(record.checkintimestamp),
          checkouttimestamp: safeString(record.checkouttimestamp),
          customerid: safeNumber(record.customerid),
          employeeid: safeNumber(record.employeeid),
          selfieimagepath: safeString(record.selfieimagepath),
          status: safeString(record.status),
          
          // Optional properties
          date: formattedDate,
          checkintime: record.checkintimestamp ? format(parseISO(safeString(record.checkintimestamp)), 'HH:mm') : '',
          checkouttime: record.checkouttimestamp ? format(parseISO(safeString(record.checkouttimestamp)), 'HH:mm') : '',
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
            firstname: safeString(record.employee.firstname),
            lastname: safeString(record.employee.lastname),
          };
          
          // Safely handle the salary object with explicit null checks
          // Fix: Add strict null check here
          if (record.employee.salary !== undefined && record.employee.salary !== null) {
            const employeeSalary = record.employee.salary;
            
            // Fix: Add extra null check here
            if (employeeSalary !== null && 
                !isSupabaseError(employeeSalary) && 
                typeof employeeSalary === 'object') {
              // Additional check for the basicsalary property
              if (employeeSalary !== null && 'basicsalary' in employeeSalary) {
                attendanceRecord.employee.salary = {
                  basicsalary: safeNumber(employeeSalary.basicsalary)
                };
              }
            }
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

// Fixed the recursive type instantiation by using a more specific return type
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
    
    // Explicitly cast to AttendanceRecord or null to avoid infinite type instantiation
    const result = data?.[0] as AttendanceRecord | null;
    return result;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    return null;
  }
};
