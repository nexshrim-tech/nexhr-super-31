import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from 'date-fns';
import { markAsAbsent, markAsNotMarked, generateDefaultAttendance } from "@/utils/attendanceDefaults";

export interface Employee {
  firstname: string;
  lastname: string;
}

export interface AttendanceRecord {
  attendanceid?: number;
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
    console.log(`Fetching attendance for date: ${date}`);
    
    // First, get all employees
    const { data: employees, error: empError } = await supabase
      .from('employee')
      .select('employeeid, firstname, lastname')
      .eq('employeestatus', 'Active');
      
    if (empError) {
      console.error("Error fetching employees:", empError);
      toast.error('Error fetching employees');
      return [];
    }
    
    if (!employees || employees.length === 0) {
      console.log("No active employees found");
      return [];
    }

    // Get existing attendance records for the date
    const { data: existingRecords, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employee(firstname, lastname)
      `)
      .eq('date', date);

    if (error) {
      console.error("Error fetching attendance records:", error);
      toast.error('Error fetching attendance records');
      return [];
    }

    console.log(`Found ${existingRecords?.length || 0} existing records`);

    // Create a map of existing records by employee ID
    const existingRecordsMap = new Map(
      existingRecords?.map(record => [record.employeeid, record]) || []
    );

    const now = new Date();
    const currentDate = new Date(date);
    const cutoffTime = new Date(currentDate);
    cutoffTime.setHours(12, 0, 0, 0);
    
    // Create default records for display
    const allRecords: AttendanceRecord[] = [];
    
    for (const employee of employees) {
      const existingRecord = existingRecordsMap.get(employee.employeeid);
      
      if (existingRecord) {
        allRecords.push({
          ...existingRecord,
          employee: {
            firstname: employee.firstname,
            lastname: employee.lastname
          }
        });
      } else {
        const defaultRecord = now < cutoffTime ? 
          markAsNotMarked(employee.employeeid, date) :
          markAsAbsent(employee.employeeid, date);
          
        allRecords.push({
          ...defaultRecord,
          attendanceid: 0,
          employee: {
            firstname: employee.firstname,
            lastname: employee.lastname
          }
        });
      }
    }

    return allRecords;
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

export const updateAttendanceRecord = async (
  id: number,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord | null> => {
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
      updatesToSend.checkintime || null, 
      updatesToSend.checkouttime || null
    );
    
    console.log('Sending to Supabase:', updatesToSend);

    // If the ID is 0, it means this is a default record not yet in the database
    if (id === 0) {
      console.log('Creating new attendance record:', updatesToSend);
      
      // Ensure employeeid is always included for new records
      if (!updatesToSend.employeeid && updates.employeeid) {
        updatesToSend.employeeid = updates.employeeid;
      }
      
      // Make sure the date field is included
      if (!updatesToSend.date && updates.date) {
        updatesToSend.date = updates.date;
      }

      if (!updatesToSend.status && updates.status) {
        updatesToSend.status = updates.status;
      }
      
      const { data, error: insertError } = await supabase
        .from('attendance')
        .insert(updatesToSend)
        .select('*, employee:employee(firstname, lastname)')
        .single();
        
      if (insertError) {
        console.error('Error inserting new attendance record:', insertError);
        toast.error('Error creating new attendance record');
        throw insertError;
      }
      
      console.log('New attendance record created successfully:', data);
      toast.success('New attendance record created successfully');
      
      return data || null;
    }

    const { data, error } = await supabase
      .from('attendance')
      .update(updatesToSend)
      .eq('attendanceid', id)
      .select('*, employee:employee(firstname, lastname)')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      toast.error('Error updating attendance record');
      throw error;
    }

    toast.success('Attendance record updated successfully');
    return data || null;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    toast.error('Failed to update attendance record');
    return null;
  }
};

const calculateWorkHours = (checkin: string | null, checkout: string | null): number | null => {
  if (!checkin || !checkout) return null;
  
  try {
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      console.error('Invalid date format for calculating work hours');
      return null;
    }
    
    // Calculate difference in hours
    const diffInMs = checkOutDate.getTime() - checkInDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    return Number(diffInHours.toFixed(2));
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
