
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
    console.log('Updating attendance record:', id, updates);
    
    // Create a copy of the updates to avoid modifying the original
    const updatesToSend: any = { ...updates };
    
    // Check if there's a valid checkintime and format it correctly
    if (updates.checkintime && updates.date) {
      // Handle case where time might already be in ISO format
      if (!updates.checkintime.includes('T')) {
        updatesToSend.checkintime = new Date(`${updates.date}T${updates.checkintime}`).toISOString();
      }
    } else if (updates.checkintime === '') {
      updatesToSend.checkintime = null;
    }
    
    // Check if there's a valid checkouttime and format it correctly
    if (updates.checkouttime && updates.date) {
      // Handle case where time might already be in ISO format
      if (!updates.checkouttime.includes('T')) {
        updatesToSend.checkouttime = new Date(`${updates.date}T${updates.checkouttime}`).toISOString();
      }
    } else if (updates.checkouttime === '') {
      updatesToSend.checkouttime = null;
    }
    
    // Calculate work hours if both times are present
    updatesToSend.workhours = calculateWorkHours(
      updates.checkintime || null, 
      updates.checkouttime || null
    );
    
    console.log('Sending to Supabase:', updatesToSend);

    const { error } = await supabase
      .from('attendance')
      .update(updatesToSend)
      .eq('attendanceid', id);

    if (error) {
      console.error('Supabase error:', error);
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
  
  try {
    // Extract just the time portion if an ISO string
    const checkInTimeStr = checkin.includes('T') ? checkin.split('T')[1].substring(0, 5) : checkin;
    const checkOutTimeStr = checkout.includes('T') ? checkout.split('T')[1].substring(0, 5) : checkout;
    
    const checkInTime = new Date(`1970-01-01T${checkInTimeStr}`);
    const checkOutTime = new Date(`1970-01-01T${checkOutTimeStr}`);
    
    const diffInHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    return parseFloat(diffInHours.toFixed(2));
  } catch (error) {
    console.error('Error calculating work hours:', error);
    return null;
  }
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
