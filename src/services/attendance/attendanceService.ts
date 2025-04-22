import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from 'date-fns';
import { markAsAbsent, markAsNotMarked, generateDefaultAttendance } from "@/utils/attendanceDefaults";

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

    // For employees without records, create and insert default records
    const employeesWithoutRecords = employees?.filter(employee => 
      !existingRecordsMap.has(employee.employeeid)
    ) || [];
    
    if (employeesWithoutRecords.length > 0) {
      console.log(`Creating ${employeesWithoutRecords.length} default records for date: ${date}`);
      
      // Generate default records based on current time
      const defaultRecords = employeesWithoutRecords.map(employee => 
        generateDefaultAttendance(employee.employeeid, new Date(date))
      );
      
      // Insert the default records into the database
      const { data: insertedRecords, error: insertError } = await supabase
        .from('attendance')
        .insert(defaultRecords)
        .select(`*, employee:employee(firstname, lastname)`);
        
      if (insertError) {
        console.error('Error inserting default records:', insertError);
        toast.error('Error creating default records');
      } else if (insertedRecords) {
        // Add the newly inserted records to our map
        insertedRecords.forEach(record => {
          existingRecordsMap.set(record.employeeid, record);
        });
      }
    }

    // Auto-mark employees as absent after 12 PM if their status is still "Not Marked"
    const now = new Date();
    const cutoffTime = new Date(date);
    cutoffTime.setHours(12, 0, 0, 0);

    if (now > cutoffTime) {
      const notMarkedRecords = Array.from(existingRecordsMap.values())
        .filter(record => record.status === 'Not Marked');

      if (notMarkedRecords.length > 0) {
        console.log(`Auto-marking ${notMarkedRecords.length} records as absent after 12 PM`);
        
        const updatePromises = notMarkedRecords.map(record => 
          supabase
            .from('attendance')
            .update({ 
              status: 'Absent',
              notes: 'Automatically marked as absent after 12 PM'
            })
            .eq('attendanceid', record.attendanceid)
        );

        await Promise.all(updatePromises);

        // Update the records in our map
        notMarkedRecords.forEach(record => {
          if (existingRecordsMap.has(record.employeeid)) {
            const updatedRecord = {
              ...record,
              status: 'Absent',
              notes: 'Automatically marked as absent after 12 PM'
            };
            existingRecordsMap.set(record.employeeid, updatedRecord);
          }
        });
      }
    }

    // Return all records
    return Array.from(existingRecordsMap.values());
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

    // Skip the update if the ID is 0, which means it's a default record not yet in the database
    if (id === 0) {
      console.warn('Attempted to update record with ID 0. Creating a new record instead.');
      // Instead, we'll insert a new record
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          ...updatesToSend,
          employeeid: updates.employeeid
        });
        
      if (insertError) {
        console.error('Error inserting new attendance record:', insertError);
        toast.error('Error creating new attendance record');
        throw insertError;
      }
      
      toast.success('New attendance record created successfully');
      return;
    }

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
