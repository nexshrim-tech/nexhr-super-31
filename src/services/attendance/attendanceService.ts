
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface AttendanceRecord {
  employeeid: number;
  customerid: number;
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
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*, employee:employeeid(firstname, lastname)')
      .gte('checkintimestamp', startOfDay.toISOString())
      .lte('checkintimestamp', endOfDay.toISOString());

    if (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }

    // Format the data to match the expected format in the UI
    const formattedData = (data || []).map(record => ({
      ...record,
      date: date,
      checkintime: record.checkintimestamp ? format(new Date(record.checkintimestamp), 'HH:mm') : '',
      checkouttime: record.checkouttimestamp ? format(new Date(record.checkouttimestamp), 'HH:mm') : '',
      workhours: calculateWorkHours(record.checkintimestamp, record.checkouttimestamp)
    }));

    return formattedData as AttendanceRecord[];
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

export const updateAttendanceRecord = async (employeeId: number, updateData: AttendanceUpdateData): Promise<AttendanceRecord> => {
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
      // For now, we'll just log it
      console.log('Notes would be saved:', updateData.notes);
    }

    // Update the record in the database
    const { data, error } = await supabase
      .from('attendance')
      .update(dataToUpdate)
      .eq('employeeid', employeeId)
      .select('*, employee:employeeid(firstname, lastname)')
      .single();

    if (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }

    // Format the data to match the expected format in the UI
    const updatedRecord = {
      ...data,
      date: updateData.date,
      checkintime: data.checkintimestamp ? format(new Date(data.checkintimestamp), 'HH:mm') : '',
      checkouttime: data.checkouttimestamp ? format(new Date(data.checkouttimestamp), 'HH:mm') : '',
      workhours: calculateWorkHours(data.checkintimestamp, data.checkouttimestamp),
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
