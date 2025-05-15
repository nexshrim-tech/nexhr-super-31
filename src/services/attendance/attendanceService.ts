
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export interface AttendanceRecord {
  employeeid: string;
  customerid: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  checkintime?: string; // Display-friendly format
  checkouttime?: string; // Display-friendly format
  date?: string; // Date for the attendance record
  workhours?: string; // Calculated work hours
  selfieimagepath?: string;
  status?: string;
  notes?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  } | null;
}

/**
 * Fetches attendance records for a specific date
 */
export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    // Format date to ISO string for proper comparison
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('attendance')
      .select(`*,
        employee:employeeid (
          firstname,
          lastname,
          jobtitle
        )
      `)
      .gte('checkintimestamp', startOfDay.toISOString())
      .lte('checkintimestamp', endOfDay.toISOString());
      
    if (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }

    return (data || []).map(record => {
      // Transform the data with calculated fields
      const checkInTime = record.checkintimestamp ? 
        format(new Date(record.checkintimestamp), 'HH:mm') : undefined;
      
      const checkOutTime = record.checkouttimestamp ? 
        format(new Date(record.checkouttimestamp), 'HH:mm') : undefined;
      
      const workHours = calculateWorkHours(
        record.checkintimestamp, 
        record.checkouttimestamp
      );
      
      // Transform the data to include formatted dates and calculated work hours
      const transformedRecord: AttendanceRecord = {
        employeeid: String(record.employeeid),
        customerid: String(record.customerid),
        checkintimestamp: record.checkintimestamp,
        checkouttimestamp: record.checkouttimestamp,
        date: date, // Add the requested date
        checkintime: checkInTime,
        checkouttime: checkOutTime,
        selfieimagepath: record.selfieimagepath,
        status: record.status,
        notes: '',
        workhours: workHours,
        // Handle employee data safely with null checks
        employee: record.employee && typeof record.employee === 'object' 
          ? {
              firstname: record.employee?.firstname || '',
              lastname: record.employee?.lastname || '',
              jobtitle: record.employee?.jobtitle || ''
            }
          : null
      };
      
      return transformedRecord;
    });
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    throw error;
  }
};

/**
 * Calculate work hours between check-in and check-out times
 */
const calculateWorkHours = (checkIn?: string, checkOut?: string): string => {
  if (!checkIn || !checkOut) return '';
  
  try {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    
    if (isNaN(checkInTime.getTime()) || isNaN(checkOutTime.getTime())) {
      return '';
    }
    
    const diff = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating work hours:', error);
    return '';
  }
};

/**
 * Updates an attendance record
 */
export const updateAttendanceRecord = async (
  employeeId: string,
  data: {
    status?: string;
    checkintime?: string;
    checkouttime?: string;
    date?: string;
    notes?: string;
    customerid?: string;
  }
): Promise<AttendanceRecord | null> => {
  try {
    const { date, checkintime, checkouttime, customerid, ...otherData } = data;
    
    // Convert time strings to timestamps if provided
    let checkintimestamp: string | undefined;
    let checkouttimestamp: string | undefined;
    
    if (date && checkintime) {
      const [hours, minutes] = checkintime.split(':');
      const checkInDate = new Date(date);
      checkInDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      checkintimestamp = checkInDate.toISOString();
    }
    
    if (date && checkouttime) {
      const [hours, minutes] = checkouttime.split(':');
      const checkOutDate = new Date(date);
      checkOutDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      checkouttimestamp = checkOutDate.toISOString();
    }
    
    // First check if a record exists for this employee on this date
    const { data: existingData } = await supabase
      .from('attendance')
      .select('*')
      .eq('employeeid', employeeId);
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const updateObject: any = { ...otherData };
      
      // Only add fields that are provided
      if (checkintimestamp) updateObject.checkintimestamp = checkintimestamp;
      if (checkouttimestamp) updateObject.checkouttimestamp = checkouttimestamp;
      
      const { data: updateData, error: updateError } = await supabase
        .from('attendance')
        .update(updateObject)
        .eq('employeeid', employeeId)
        .select('*')
        .single();
      
      if (updateError) {
        console.error('Error updating attendance record:', updateError);
        throw updateError;
      }
      
      return updateData ? {
        ...updateData,
        employeeid: String(updateData.employeeid),
        customerid: String(updateData.customerid),
        checkintime: checkintime || (updateData.checkintimestamp ? format(new Date(updateData.checkintimestamp), 'HH:mm') : undefined),
        checkouttime: checkouttime || (updateData.checkouttimestamp ? format(new Date(updateData.checkouttimestamp), 'HH:mm') : undefined),
        date: date
      } : null;
    } else {
      // We need a customerid for new records
      if (!customerid) {
        console.error('Customer ID is required for creating new attendance records');
        throw new Error('Customer ID is required for creating new attendance records');
      }
      
      // Create new record
      const insertObject: any = {
        employeeid: employeeId,
        customerid: customerid
      };
      
      // Only add fields that are provided
      if (checkintimestamp) insertObject.checkintimestamp = checkintimestamp;
      if (checkouttimestamp) insertObject.checkouttimestamp = checkouttimestamp;
      if (otherData.status) insertObject.status = otherData.status;
      
      const { data: insertData, error: insertError } = await supabase
        .from('attendance')
        .insert(insertObject)
        .select('*')
        .single();
      
      if (insertError) {
        console.error('Error creating attendance record:', insertError);
        throw insertError;
      }
      
      return insertData ? {
        ...insertData,
        employeeid: String(insertData.employeeid),
        customerid: String(insertData.customerid),
        checkintime: checkintime,
        checkouttime: checkouttime,
        date: date,
        notes: otherData.notes
      } : null;
    }
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};

/**
 * Setup a Supabase channel to listen for attendance changes
 */
export const setupAttendanceSubscription = () => {
  const channel = supabase.channel('attendance-changes');
  return channel;
};
