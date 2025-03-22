
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id?: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  selfiePath?: string;
}

// Define a type for the database record to avoid excessive type inference
interface AttendanceDbRecord {
  id?: number;
  employeeid: number;
  customerid: number;
  checkintimestamp: string;
  checkouttimestamp?: string;
  status: string;
  selfieimagepath?: string;
  employee?: {
    employeeid: number;
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

// Fetch attendance records for a specific customer
export const fetchAttendanceRecords = async (
  customerId: number,
  startDate?: string,
  endDate?: string,
  employeeId?: number
): Promise<AttendanceRecord[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          employeeid,
          firstname,
          lastname,
          jobtitle
        )
      `)
      .eq('customerid', customerId);

    // Add date range filter if provided
    if (startDate) {
      query = query.gte('checkintimestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('checkintimestamp', endDate);
    }
    
    // Add employee filter if provided
    if (employeeId) {
      query = query.eq('employeeid', employeeId);
    }
    
    const { data, error } = await query.order('checkintimestamp', { ascending: false });
    
    if (error) throw error;
    
    // Create an empty array with the specific type to avoid type inference issues
    const result: AttendanceRecord[] = [];
    
    if (!data) return result;
    
    // Process each record manually to avoid complex type derivations
    for (let i = 0; i < data.length; i++) {
      const record = data[i] as AttendanceDbRecord;
      // Access employee data with proper type checking
      const employee = record.employee || { firstname: '', lastname: '' };
      
      // Parse dates
      const checkInDate = record.checkintimestamp ? new Date(record.checkintimestamp) : null;
      const checkOutDate = record.checkouttimestamp ? new Date(record.checkouttimestamp) : null;
      
      const recordObj: AttendanceRecord = {
        employeeId: record.employeeid,
        employeeName: `${employee.firstname || ''} ${employee.lastname || ''}`,
        date: checkInDate ? checkInDate.toISOString().split('T')[0] : '',
        checkIn: checkInDate ? checkInDate.toTimeString().slice(0, 5) : '',
        checkOut: checkOutDate ? checkOutDate.toTimeString().slice(0, 5) : '',
        status: record.status || 'Unknown',
        selfiePath: record.selfieimagepath
      };

      // Add id if it exists with the correct property name - with explicit type casting
      if ('id' in record && typeof record.id === 'number') {
        recordObj.id = record.id;
      }
      
      result.push(recordObj);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

// Interface for attendance record creation
export interface AddAttendanceInput {
  employeeId: number;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: string;
  selfiePath?: string;
}

// Add a new attendance record
export const addAttendanceRecord = async (
  customerId: number,
  record: AddAttendanceInput
): Promise<any> => {
  try {
    // Format timestamps
    const checkInTimestamp = new Date(`${record.date}T${record.checkIn}`).toISOString();
    const checkOutTimestamp = record.checkOut 
      ? new Date(`${record.date}T${record.checkOut}`).toISOString() 
      : null;
    
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        employeeid: record.employeeId,
        customerid: customerId,
        checkintimestamp: checkInTimestamp,
        checkouttimestamp: checkOutTimestamp,
        status: record.status,
        selfieimagepath: record.selfiePath
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding attendance record:', error);
    throw error;
  }
};

// Update interface to help with type safety
export interface AttendanceRecordUpdate {
  checkIn?: string;
  checkOut?: string;
  status?: string;
  date?: string;
}

// Update an existing attendance record
export const updateAttendanceRecord = async (
  recordId: number,
  updates: AttendanceRecordUpdate
): Promise<any> => {
  try {
    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (updates.date && updates.checkIn) {
      updateData.checkintimestamp = new Date(`${updates.date}T${updates.checkIn}`).toISOString();
    }
    
    if (updates.date && updates.checkOut) {
      updateData.checkouttimestamp = new Date(`${updates.date}T${updates.checkOut}`).toISOString();
    }
    
    if (updates.status) {
      updateData.status = updates.status;
    }
    
    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', recordId)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
};

// Delete an attendance record
export const deleteAttendanceRecord = async (recordId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', recordId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    throw error;
  }
};
