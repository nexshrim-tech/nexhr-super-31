
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Employee {
  firstname: string;
  lastname: string;
}

export interface AttendanceRecord {
  attendanceid: number;
  employeeid: number;
  date: string;
  checkintime: string | null;
  checkouttime: string | null;
  workhours: number | null;
  location: string | null;
  notes: string | null;
  status: string | null;
  employee?: Employee | null; // Add this property to match what's returned from Supabase join
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        attendanceid,
        employeeid,
        date,
        checkintime,
        checkouttime,
        workhours,
        location,
        notes,
        status,
        employee:employee(firstname, lastname)
      `)
      .eq('date', date);

    if (error) {
      toast.error('Error fetching attendance records');
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

export const updateAttendanceRecord = async (
  id: number,
  updates: Partial<AttendanceRecord>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('attendanceid', id);

    if (error) {
      toast.error('Error updating attendance record');
      throw error;
    }

    toast.success('Attendance record updated successfully');
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
  }
};

export const markAttendance = async (
  employeeId: number,
  type: 'checkin' | 'checkout',
  location?: string
): Promise<void> => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toISOString();

    // Check if an attendance record already exists for today
    const { data: existingRecord } = await supabase
      .from('attendance')
      .select()
      .eq('employeeid', employeeId)
      .eq('date', today)
      .single();

    if (type === 'checkin' && !existingRecord) {
      // Create new attendance record for check-in
      const { error } = await supabase
        .from('attendance')
        .insert({
          employeeid: employeeId,
          date: today,
          checkintime: currentTime,
          location,
          status: 'Present'
        });

      if (error) throw error;
      toast.success('Check-in recorded successfully');
    } else if (type === 'checkout' && existingRecord) {
      // Update existing record with checkout time
      const checkInTime = new Date(existingRecord.checkintime);
      const workHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // Convert to hours

      const { error } = await supabase
        .from('attendance')
        .update({
          checkouttime: currentTime,
          workhours: parseFloat(workHours.toFixed(2)),
          location
        })
        .eq('attendanceid', existingRecord.attendanceid);

      if (error) throw error;
      toast.success('Check-out recorded successfully');
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    toast.error('Failed to record attendance');
  }
};
