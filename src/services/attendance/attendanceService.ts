import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface EmployeeBasic {
  firstname: string | null;
  lastname: string | null;
  salary?: {
    basicsalary: number;
  } | null;
}

export interface AttendanceRecord {
  attendanceid?: number;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  customerid: number | null;
  employeeid: number | null;
  selfieimagepath: string | null;
  status: string | null;
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

const isSupabaseError = (obj: any): boolean => {
  return obj && typeof obj === 'object' && 'error' in obj;
};

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

    const processedData: AttendanceRecord[] = data?.map(record => {
      const attendanceRecord: AttendanceRecord = {
        checkintimestamp: safeString(record.checkintimestamp),
        checkouttimestamp: safeString(record.checkouttimestamp),
        customerid: safeNumber(record.customerid),
        employeeid: safeNumber(record.employeeid),
        selfieimagepath: safeString(record.selfieimagepath),
        status: safeString(record.status),
      };
      
      if (record.employee) {
        attendanceRecord.employee = {
          firstname: safeString(record.employee.firstname),
          lastname: safeString(record.employee.lastname),
          salary: null // Initialize as null by default
        };
        
        // Carefully check the salary object and its properties
        const salary = record.employee.salary;
        if (salary && 
            !isSupabaseError(salary) && 
            typeof salary === 'object' &&
            salary !== null && 
            'basicsalary' in salary &&
            typeof salary.basicsalary === 'number') {
          attendanceRecord.employee.salary = {
            basicsalary: salary.basicsalary
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
        const attendanceRecord: AttendanceRecord = {
          checkintimestamp: safeString(record.checkintimestamp),
          checkouttimestamp: safeString(record.checkouttimestamp),
          customerid: safeNumber(record.customerid),
          employeeid: safeNumber(record.employeeid),
          selfieimagepath: safeString(record.selfieimagepath),
          status: safeString(record.status),
          date: formattedDate,
          checkintime: record.checkintimestamp ? format(parseISO(safeString(record.checkintimestamp)), 'HH:mm') : '',
          checkouttime: record.checkouttimestamp ? format(parseISO(safeString(record.checkouttimestamp)), 'HH:mm') : '',
          workhours: '',
        };
        
        if (record.employee) {
          attendanceRecord.employee = {
            firstname: safeString(record.employee.firstname),
            lastname: safeString(record.employee.lastname),
            salary: null // Initialize as null by default
          };
          
          // Carefully check the salary object and its properties
          const salary = record.employee.salary;
          if (salary && 
              !isSupabaseError(salary) && 
              typeof salary === 'object' &&
              salary !== null && 
              'basicsalary' in salary &&
              typeof salary.basicsalary === 'number') {
            attendanceRecord.employee.salary = {
              basicsalary: salary.basicsalary
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
    
    const result = data && data[0] ? {
      ...data[0],
      employee: data[0].employee || undefined
    } as AttendanceRecord : null;
    
    return result;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    return null;
  }
};
