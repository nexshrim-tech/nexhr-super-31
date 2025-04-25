
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface EmployeeBasic {
  firstname: string | null;
  lastname: string | null;
  salary?: {
    monthlysalary: number;  // We'll keep this structure for backward compatibility but populate it with monthlysalary
  } | null;
}

export interface AttendanceRecord {
  employeeid: number;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  customerid: number;
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
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `);

    if (attendanceError) {
      console.error('Error fetching attendance records:', attendanceError);
      return [];
    }

    const { data: salaryData, error: salaryError } = await supabase
      .from('employee')
      .select('employeeid, monthlysalary'); // Changed from salary to monthlysalary

    if (salaryError) {
      console.error('Error fetching salary data:', salaryError);
      return [];
    }

    const salaryMap = new Map(
      salaryData.map(salary => [salary.employeeid, salary.monthlysalary]) // Changed from salary to monthlysalary
    );

    const processedData: AttendanceRecord[] = (attendanceData || []).map((record: any) => {
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
          salary: {
            monthlysalary: salaryMap.get(record.employeeid) || 0
          }
        };
      }
      
      return attendanceRecord;
    });

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
          lastname
        )
      `)
      .gte('checkintimestamp', startOfDay)
      .lte('checkintimestamp', endOfDay);

    if (error) {
      console.error('Error fetching attendance for date:', error);
      return [];
    }

    const { data: salaryData, error: salaryError } = await supabase
      .from('employee')
      .select('employeeid, monthlysalary'); // Changed from salary to monthlysalary

    if (salaryError) {
      console.error('Error fetching salary data:', salaryError);
      return [];
    }

    const salaryMap = new Map(
      salaryData.map(salary => [salary.employeeid, salary.monthlysalary]) // Changed from salary to monthlysalary
    );

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
            salary: {
              monthlysalary: salaryMap.get(record.employeeid) || 0
            }
          };
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
  employeeId: number, 
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
    
    const { data, error } = await supabase
      .from('attendance')
      .update(updatedData)
      .eq('employeeid', employeeId)
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating attendance record:', error);
      return null;
    }
    
    const { data: employeeData, error: salaryError } = await supabase
      .from('employee')
      .select('monthlysalary') // Changed from salary to monthlysalary
      .eq('employeeid', data.employeeid)
      .maybeSingle();
    
    if (salaryError) {
      console.error('Error fetching salary data:', salaryError);
    }
    
    const result: AttendanceRecord = {
      checkintimestamp: safeString(data.checkintimestamp),
      checkouttimestamp: safeString(data.checkouttimestamp),
      customerid: safeNumber(data.customerid),
      employeeid: safeNumber(data.employeeid),
      selfieimagepath: safeString(data.selfieimagepath),
      status: safeString(data.status),
    };
    
    if (data.employee) {
      result.employee = {
        firstname: safeString(data.employee.firstname),
        lastname: safeString(data.employee.lastname),
        salary: {
          monthlysalary: employeeData?.monthlysalary || 0 // Changed from salary to monthlysalary
        }
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    return null;
  }
};
