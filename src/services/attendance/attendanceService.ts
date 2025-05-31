
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord } from '@/types/attendance';

export const getAttendanceRecords = async (customerId?: string): Promise<AttendanceRecord[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employee:employee!attendance_employeeid_fkey(firstname, lastname, jobtitle)
      `);
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('checkintimestamp', { ascending: false });

    if (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }

    // Transform data to match AttendanceRecord interface
    return (data || []).map(record => {
      const checkInTime = record.checkintimestamp ? new Date(record.checkintimestamp) : null;
      const checkOutTime = record.checkouttimestamp ? new Date(record.checkouttimestamp) : null;
      
      // Calculate work hours if both times are available
      let workHours = '';
      if (checkInTime && checkOutTime) {
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        workHours = `${hours}h ${minutes}m`;
      }

      return {
        employeeid: record.employeeid,
        customerid: record.customerid,
        checkintimestamp: record.checkintimestamp,
        checkouttimestamp: record.checkouttimestamp,
        selfieimagepath: record.selfieimagepath,
        status: record.status,
        date: checkInTime ? checkInTime.toISOString().split('T')[0] : '',
        checkintime: checkInTime ? checkInTime.toTimeString().split(' ')[0] : '',
        checkouttime: checkOutTime ? checkOutTime.toTimeString().split(' ')[0] : '',
        workhours: workHours,
        employee: record.employee || undefined
      };
    }) as AttendanceRecord[];
  } catch (error) {
    console.error('Error in getAttendanceRecords:', error);
    throw error;
  }
};

export const getAttendanceForDate = async (date: string, customerId?: string): Promise<AttendanceRecord[]> => {
  try {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        employee:employee!attendance_employeeid_fkey(firstname, lastname, jobtitle)
      `);
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    // Filter by date using checkintimestamp
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;
    
    query = query
      .gte('checkintimestamp', startOfDay)
      .lte('checkintimestamp', endOfDay);
    
    const { data, error } = await query.order('checkintimestamp', { ascending: false });

    if (error) {
      console.error('Error fetching attendance for date:', error);
      throw error;
    }

    return (data || []).map(record => {
      const checkInTime = record.checkintimestamp ? new Date(record.checkintimestamp) : null;
      const checkOutTime = record.checkouttimestamp ? new Date(record.checkouttimestamp) : null;
      
      let workHours = '';
      if (checkInTime && checkOutTime) {
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        workHours = `${hours}h ${minutes}m`;
      }

      return {
        employeeid: record.employeeid,
        customerid: record.customerid,
        checkintimestamp: record.checkintimestamp,
        checkouttimestamp: record.checkouttimestamp,
        selfieimagepath: record.selfieimagepath,
        status: record.status,
        date: checkInTime ? checkInTime.toISOString().split('T')[0] : '',
        checkintime: checkInTime ? checkInTime.toTimeString().split(' ')[0] : '',
        checkouttime: checkOutTime ? checkOutTime.toTimeString().split(' ')[0] : '',
        workhours: workHours,
        employee: record.employee || undefined
      };
    }) as AttendanceRecord[];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    throw error;
  }
};

export const setupAttendanceSubscription = () => {
  return supabase.channel('attendance-changes');
};

export const createAttendanceRecord = async (attendanceData: {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes: string;
}): Promise<AttendanceRecord> => {
  try {
    // Create timestamps from date and times
    const checkInTimestamp = attendanceData.checkIn 
      ? new Date(`${attendanceData.date}T${attendanceData.checkIn}:00.000Z`).toISOString()
      : null;
    
    const checkOutTimestamp = attendanceData.checkOut 
      ? new Date(`${attendanceData.date}T${attendanceData.checkOut}:00.000Z`).toISOString()
      : null;

    // Get current customer ID (you might need to implement this based on your auth)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const record = {
      employeeid: attendanceData.employeeId,
      customerid: user.id, // Adjust this based on your customer ID logic
      checkintimestamp: checkInTimestamp,
      checkouttimestamp: checkOutTimestamp,
      status: attendanceData.status,
      selfieimagepath: null
    };

    const { data, error } = await supabase
      .from('attendance')
      .insert(record)
      .select(`
        *,
        employee:employee!attendance_employeeid_fkey(firstname, lastname, jobtitle)
      `)
      .single();

    if (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }

    // Transform the response to match our interface
    const checkInTime = data.checkintimestamp ? new Date(data.checkintimestamp) : null;
    const checkOutTime = data.checkouttimestamp ? new Date(data.checkouttimestamp) : null;
    
    let workHours = '';
    if (checkInTime && checkOutTime) {
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      workHours = `${hours}h ${minutes}m`;
    }

    return {
      employeeid: data.employeeid,
      customerid: data.customerid,
      checkintimestamp: data.checkintimestamp,
      checkouttimestamp: data.checkouttimestamp,
      selfieimagepath: data.selfieimagepath,
      status: data.status,
      date: checkInTime ? checkInTime.toISOString().split('T')[0] : '',
      checkintime: checkInTime ? checkInTime.toTimeString().split(' ')[0] : '',
      checkouttime: checkOutTime ? checkOutTime.toTimeString().split(' ')[0] : '',
      workhours: workHours,
      employee: data.employee || undefined
    };
  } catch (error) {
    console.error('Error in createAttendanceRecord:', error);
    throw error;
  }
};

export const updateAttendanceRecord = async (employeeid: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('employeeid', employeeid)
      .select(`
        *,
        employee:employee!attendance_employeeid_fkey(firstname, lastname, jobtitle)
      `)
      .single();

    if (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }

    const checkInTime = data.checkintimestamp ? new Date(data.checkintimestamp) : null;
    const checkOutTime = data.checkouttimestamp ? new Date(data.checkouttimestamp) : null;
    
    let workHours = '';
    if (checkInTime && checkOutTime) {
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      workHours = `${hours}h ${minutes}m`;
    }

    return {
      employeeid: data.employeeid,
      customerid: data.customerid,
      checkintimestamp: data.checkintimestamp,
      checkouttimestamp: data.checkouttimestamp,
      selfieimagepath: data.selfieimagepath,
      status: data.status,
      date: checkInTime ? checkInTime.toISOString().split('T')[0] : '',
      checkintime: checkInTime ? checkInTime.toTimeString().split(' ')[0] : '',
      checkouttime: checkOutTime ? checkOutTime.toTimeString().split(' ')[0] : '',
      workhours: workHours,
      employee: data.employee || undefined
    };
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (employeeid: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('employeeid', employeeid);

    if (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAttendanceRecord:', error);
    throw error;
  }
};

export type { AttendanceRecord };
