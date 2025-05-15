
import { supabase } from '@/integrations/supabase/client';
import { formatISO } from 'date-fns';

export interface AttendanceRecord {
  employeeid: string; // Changed from number to string to match Supabase
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  status?: string;
  customerid?: string; // Changed from number to string
  notes?: string;
  selfieimagepath?: string;
  workhours?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
    [key: string]: any;
  };
}

export const getAttendanceForDate = async (dateString: string): Promise<AttendanceRecord[]> => {
  try {
    // First get attendance records for the date
    const { data: existingRecords, error: attendanceError } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname,
          jobtitle
        )
      `)
      .eq('date', dateString);
      
    if (attendanceError) {
      console.error('Error fetching attendance data:', attendanceError);
      throw attendanceError;
    }

    // Convert all records to ensure proper types
    const formattedRecords = (existingRecords || []).map(record => ({
      employeeid: String(record.employeeid),
      date: record.date || dateString,
      checkintime: record.checkintime || '',
      checkouttime: record.checkouttime || '',
      checkintimestamp: record.checkintimestamp || null,
      checkouttimestamp: record.checkouttimestamp || null,
      workhours: record.workhours || '',
      status: record.status || null,
      customerid: String(record.customerid || ''),
      notes: record.notes || '',
      selfieimagepath: record.selfieimagepath || null,
      employee: typeof record.employee === 'object' && record.employee ? {
        firstname: record.employee.firstname || '',
        lastname: record.employee.lastname || '',
        jobtitle: record.employee.jobtitle || '',
      } : {
        firstname: '',
        lastname: '',
        jobtitle: '',
      }
    }));

    // Also fetch all employees to ensure we have data for employees without attendance records
    const { data: allEmployees, error: employeesError } = await supabase
      .from('employee')
      .select('employeeid, firstname, lastname, jobtitle');
      
    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
      // Still return available attendance records if we have them
      return formattedRecords;
    }

    // Add empty attendance records for employees that don't have one for this date
    const employeesWithoutAttendance = (allEmployees || []).filter(emp => 
      !formattedRecords.some(rec => String(rec.employeeid) === String(emp.employeeid))
    ).map(emp => ({
      employeeid: String(emp.employeeid),
      date: dateString,
      status: 'Not Marked',
      employee: {
        firstname: emp.firstname || '',
        lastname: emp.lastname || '',
        jobtitle: emp.jobtitle || '',
      },
      checkintime: '',
      checkouttime: '',
      workhours: '',
      checkintimestamp: null,
      checkouttimestamp: null,
      customerid: '',
      notes: '',
      selfieimagepath: '',
    }));

    // Combine both arrays and return
    return [...formattedRecords, ...employeesWithoutAttendance];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    throw error;
  }
};

export const markAttendance = async (
  employeeId: string,
  isCheckIn: boolean,
  location?: { latitude: number; longitude: number },
  selfiePath?: string
): Promise<AttendanceRecord> => {
  try {
    const now = new Date();
    const today = formatISO(now, { representation: 'date' });
    const timestamp = now.toISOString();

    // Get existing attendance for today
    const { data: existing, error: fetchError } = await supabase
      .from('attendance')
      .select('*')
      .eq('employeeid', employeeId)
      .eq('date', today)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error fetching existing attendance:', fetchError);
      throw fetchError;
    }

    let result;
    
    if (isCheckIn) {
      // For check-in, either create new record or update existing
      if (existing) {
        // Update existing record with check-in time
        const { data, error } = await supabase
          .from('attendance')
          .update({
            checkintimestamp: timestamp,
            checkintime: now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
            status: 'Present'
          })
          .eq('employeeid', employeeId)
          .eq('date', today)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating check-in time:', error);
          throw error;
        }
        
        result = data;
      } else {
        // Create new attendance record
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            employeeid: employeeId,
            date: today,
            checkintimestamp: timestamp,
            checkintime: now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
            status: 'Present',
            selfieimagepath: selfiePath || null
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating attendance record:', error);
          throw error;
        }
        
        result = data;
      }
    } else {
      // For check-out, update existing record
      if (existing) {
        const { data, error } = await supabase
          .from('attendance')
          .update({
            checkouttimestamp: timestamp,
            checkouttime: now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
          })
          .eq('employeeid', employeeId)
          .eq('date', today)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating check-out time:', error);
          throw error;
        }
        
        result = data;
      } else {
        throw new Error('Cannot check-out without prior check-in');
      }
    }
    
    // Return properly formatted record with string IDs
    return {
      employeeid: String(result.employeeid),
      date: result.date,
      checkintime: result.checkintime,
      checkouttime: result.checkouttime,
      checkintimestamp: result.checkintimestamp,
      checkouttimestamp: result.checkouttimestamp,
      status: result.status,
      customerid: String(result.customerid || ''),
      notes: result.notes,
      selfieimagepath: result.selfieimagepath
    };
  } catch (error) {
    console.error('Error in markAttendance:', error);
    throw error;
  }
};

export const updateAttendanceRecord = async (
  employeeId: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord> => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .upsert({
        employeeid: employeeId,
        date: updates.date,
        status: updates.status,
        checkintime: updates.checkintime,
        checkouttime: updates.checkouttime,
        notes: updates.notes
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
    
    // Return properly formatted record with string IDs
    return {
      employeeid: String(data.employeeid),
      date: data.date,
      checkintime: data.checkintime,
      checkouttime: data.checkouttime,
      checkintimestamp: data.checkintimestamp,
      checkouttimestamp: data.checkouttimestamp,
      status: data.status,
      customerid: String(data.customerid || ''),
      notes: data.notes,
      selfieimagepath: data.selfieimagepath
    };
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};

// Set up a subscription for real-time attendance updates
export const setupAttendanceSubscription = () => {
  return supabase
    .channel('attendance-changes')
    .on('postgres_changes', 
      {
        event: '*',
        schema: 'public',
        table: 'attendance'
      },
      payload => {
        console.log('Attendance change received:', payload);
      }
    )
    .subscribe();
};
