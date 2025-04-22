
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from 'date-fns';
import { markAsAbsent } from "@/utils/attendanceDefaults";

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
  employee?: Employee | null;
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    // First, get all employees
    const { data: employees } = await supabase
      .from('employee')
      .select('employeeid')
      .eq('employeestatus', 'Active');

    // Get existing attendance records for the date
    const { data: existingRecords, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employee(firstname, lastname)
      `)
      .eq('date', date);

    if (error) {
      toast.error('Error fetching attendance records');
      throw error;
    }

    // Create a map of existing records by employee ID
    const existingRecordsMap = new Map(
      existingRecords?.map(record => [record.employeeid, record]) || []
    );

    // For each employee, either return their existing record or create a default absent record
    const allRecords = employees?.map(employee => {
      return existingRecordsMap.get(employee.employeeid) || 
             markAsAbsent(employee.employeeid, date) as AttendanceRecord;
    }) || [];

    return allRecords;
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
    // Convert time strings to ISO format if they exist
    const formattedUpdates = {
      ...updates,
      checkintime: updates.checkintime ? new Date(updates.date + 'T' + updates.checkintime).toISOString() : null,
      checkouttime: updates.checkouttime ? new Date(updates.date + 'T' + updates.checkouttime).toISOString() : null,
      workhours: calculateWorkHours(updates.checkintime, updates.checkouttime)
    };

    const { error } = await supabase
      .from('attendance')
      .update(formattedUpdates)
      .eq('attendanceid', id);

    if (error) {
      toast.error('Error updating attendance record');
      throw error;
    }

    toast.success('Attendance record updated successfully');
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    toast.error('Failed to update attendance record');
  }
};

const calculateWorkHours = (checkin: string | null, checkout: string | null): number | null => {
  if (!checkin || !checkout) return null;
  
  const checkInTime = new Date(`1970-01-01T${checkin}`);
  const checkOutTime = new Date(`1970-01-01T${checkout}`);
  
  const diffInHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
  return parseFloat(diffInHours.toFixed(2));
};

export const insertDefaultAbsentRecord = async (employeeId: number, date: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .insert([markAsAbsent(employeeId, date)]);

    if (error) {
      toast.error('Error marking attendance as absent');
      throw error;
    }

    toast.success('Attendance marked as absent');
  } catch (error) {
    console.error('Error in insertDefaultAbsentRecord:', error);
    toast.error('Failed to mark attendance as absent');
  }
};
