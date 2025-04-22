
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
  employee?: Employee | null;
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
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

