
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface AttendanceRecord {
  employeeid: number;
  customerid: number;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  status: string;
  selfieimagepath?: string | null;
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
      .select('*')
      .gte('checkintimestamp', startOfDay.toISOString())
      .lte('checkintimestamp', endOfDay.toISOString());

    if (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }

    return data as AttendanceRecord[] || [];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
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
