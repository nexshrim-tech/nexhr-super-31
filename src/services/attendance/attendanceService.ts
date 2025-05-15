
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface AttendanceRecord {
  employeeid: string;
  customerid: string;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  status: string;
  selfieimagepath?: string | null;
  // Additional fields needed by UI components
  employee?: {
    firstname?: string;
    lastname?: string;
  };
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  workhours?: string;
  notes?: string;
}

export interface AttendanceUpdateData {
  status?: string;
  checkintime?: string;
  checkouttime?: string;
  date?: string;
  notes?: string;
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    // Convert the date string to the start and end of the day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // First get all employees
    const { data: employees, error: employeesError } = await supabase
      .from('employee')
      .select('employeeid, firstname, lastname')
      .eq('employmentstatus', 'Active');
    
    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
      throw employeesError;
    }
    
    // Then get attendance records for the day
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*, employee:employeeid(firstname, lastname)')
      .gte('checkintimestamp', startOfDay.toISOString())
      .lte('checkintimestamp', endOfDay.toISOString());

    if (attendanceError) {
      console.error('Error fetching attendance data:', attendanceError);
      throw attendanceError;
    }

    // Format the data to match the expected format in the UI
    const formattedAttendanceData = (attendanceData || []).map(record => ({
      ...record,
      date: date,
      checkintime: record.checkintimestamp ? format(new Date(record.checkintimestamp), 'HH:mm') : '',
      checkouttime: record.checkouttimestamp ? format(new Date(record.checkouttimestamp), 'HH:mm') : '',
      workhours: calculateWorkHours(record.checkintimestamp, record.checkouttimestamp)
    }));
    
    // Create a map of employees with attendance records
    const employeesWithAttendance = new Map(
      formattedAttendanceData.map(record => [record.employeeid, record])
    );
    
    // For employees without attendance, mark them as absent
    const absentEmployees = (employees || [])
      .filter(emp => !employeesWithAttendance.has(emp.employeeid))
      .map(emp => ({
        employeeid: emp.employeeid,
        customerid: null,
        checkintimestamp: null,
        checkouttimestamp: null,
        status: 'Absent',
        date: date,
        checkintime: '',
        checkouttime: '',
        workhours: '-',
        employee: {
          firstname: emp.firstname,
          lastname: emp.lastname
        },
        notes: 'Automatically marked absent'
      }));
    
    // Combine the actual attendance with absent records
    return [...formattedAttendanceData, ...absentEmployees] as AttendanceRecord[];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    throw error;
  }
};

// Enable real-time subscription for attendance records
export const setupAttendanceSubscription = () => {
  return supabase
    .channel('attendance-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'attendance'
      },
      (payload) => {
        console.log('Attendance data changed:', payload);
        return payload;
      }
    )
    .subscribe();
};

export const updateAttendanceRecord = async (employeeId: string, updateData: AttendanceUpdateData): Promise<AttendanceRecord> => {
  try {
    // Prepare the update data
    const dataToUpdate: any = {};
    
    if (updateData.status) {
      dataToUpdate.status = updateData.status;
    }
    
    if (updateData.checkintime) {
      // Convert time string to timestamp if date is available
      if (updateData.date) {
        const [hours, minutes] = updateData.checkintime.split(':');
        const checkInDate = new Date(updateData.date);
        checkInDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        dataToUpdate.checkintimestamp = checkInDate.toISOString();
      }
    }
    
    if (updateData.checkouttime) {
      // Convert time string to timestamp if date is available
      if (updateData.date) {
        const [hours, minutes] = updateData.checkouttime.split(':');
        const checkOutDate = new Date(updateData.date);
        checkOutDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        dataToUpdate.checkouttimestamp = checkOutDate.toISOString();
      }
    }
    
    if (updateData.notes) {
      // If we want to store notes, we'd need a column for it in the database
      console.log('Notes would be saved:', updateData.notes);
    }

    // First check if record already exists for this employee on this date
    const formattedDate = updateData.date;
    const startOfDay = new Date(formattedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(formattedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: existingRecord, error: existingError } = await supabase
      .from('attendance')
      .select('*')
      .eq('employeeid', employeeId)
      .gte('checkintimestamp', startOfDay.toISOString())
      .lte('checkintimestamp', endOfDay.toISOString())
      .maybeSingle();

    if (existingError) {
      console.error('Error checking for existing attendance record:', existingError);
    }

    let result;

    // If record exists, update it
    if (existingRecord) {
      const { data, error } = await supabase
        .from('attendance')
        .update(dataToUpdate)
        .eq('employeeid', employeeId)
        .eq('checkintimestamp', existingRecord.checkintimestamp)
        .select('*, employee:employeeid(firstname, lastname)')
        .single();

      if (error) {
        console.error('Error updating attendance record:', error);
        throw error;
      }
      
      result = data;
    } 
    // If no record exists and we have check-in data, create a new one
    else if (dataToUpdate.checkintimestamp || updateData.status === 'Present' || updateData.status === 'Late' || updateData.status === 'Half Day' || updateData.status === 'Work From Home') {
      // Make sure we have a valid check-in timestamp
      if (!dataToUpdate.checkintimestamp) {
        // If no check-in time provided but status is present, use current time
        const now = new Date(updateData.date);
        now.setHours(9, 0, 0, 0); // Default to 9 AM
        dataToUpdate.checkintimestamp = now.toISOString();
      }
      
      // Set employeeid for the new record
      dataToUpdate.employeeid = employeeId;
      
      const { data, error } = await supabase
        .from('attendance')
        .insert(dataToUpdate)
        .select('*, employee:employeeid(firstname, lastname)')
        .single();

      if (error) {
        console.error('Error creating attendance record:', error);
        throw error;
      }
      
      result = data;
    }
    // For other cases where we don't need to create a record (like keeping Absent status)
    else {
      // Return a constructed record for the UI
      return {
        employeeid: employeeId,
        customerid: null,
        checkintimestamp: null,
        checkouttimestamp: null,
        status: updateData.status || 'Absent',
        date: updateData.date,
        checkintime: updateData.checkintime || '',
        checkouttime: updateData.checkouttime || '',
        workhours: '-',
        notes: updateData.notes
      } as AttendanceRecord;
    }

    // Format the data to match the expected format in the UI
    const updatedRecord = {
      ...result,
      date: updateData.date,
      checkintime: result.checkintimestamp ? format(new Date(result.checkintimestamp), 'HH:mm') : '',
      checkouttime: result.checkouttimestamp ? format(new Date(result.checkouttimestamp), 'HH:mm') : '',
      workhours: calculateWorkHours(result.checkintimestamp, result.checkouttimestamp),
      notes: updateData.notes
    } as AttendanceRecord;

    return updatedRecord;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};

export const getTodayAttendanceCounts = async (): Promise<{
  present: number;
  absent: number;
  late: number;
}> => {
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const attendanceRecords = await getAttendanceForDate(todayDate);
  
  return {
    present: attendanceRecords.filter(record => record.status === 'Present').length,
    absent: attendanceRecords.filter(record => record.status === 'Absent').length,
    late: attendanceRecords.filter(record => record.status === 'Late').length,
  };
};

// Helper function to calculate work hours
const calculateWorkHours = (checkIn: string | null, checkOut: string | null): string => {
  if (!checkIn || !checkOut) return '-';
  
  try {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    
    // Calculate difference in milliseconds
    const diff = checkOutTime.getTime() - checkInTime.getTime();
    
    // Convert to hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    return '-';
  }
};
