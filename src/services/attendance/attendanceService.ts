
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from 'date-fns';
import { markAsAbsent, markAsNotMarked } from "@/utils/attendanceDefaults";

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
  customerid?: number | null; // Added to support multi-tenancy
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    console.log(`Fetching attendance for date: ${date}`);
    
    // First, get all active employees from the current user's company
    // RLS will automatically filter to only show employees from the user's company
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

    // Since 'attendance' table doesn't have the fields we need in our interface,
    // we'll need to adapt the data
    const { data: existingRecords, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employee(firstname, lastname)
      `)
      .eq('status', date); // Using status field temporarily for date

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
    
    // Create records array including both existing and default records
    const allRecords = employees.map(employee => {
      const existingRecord = existingRecordsMap.get(employee.employeeid);
      
      if (existingRecord) {
        // Map database record to interface format
        return {
          attendanceid: existingRecord.attendanceid || 0,
          employeeid: existingRecord.employeeid,
          date: date,
          checkintime: existingRecord.checkintimestamp ? 
            format(new Date(existingRecord.checkintimestamp), 'HH:mm:ss') : null,
          checkouttime: existingRecord.checkouttimestamp ? 
            format(new Date(existingRecord.checkouttimestamp), 'HH:mm:ss') : null,
          workhours: calculateWorkhours(existingRecord.checkintimestamp, existingRecord.checkouttimestamp),
          location: null,
          notes: null,
          status: existingRecord.status || 'Not Marked',
          employee: {
            firstname: employee.firstname,
            lastname: employee.lastname
          },
          customerid: existingRecord.customerid
        };
      }

      // Create default record for employees without attendance
      const defaultRecord = now < cutoffTime ? 
        markAsNotMarked(employee.employeeid, date) :
        markAsAbsent(employee.employeeid, date);

      return {
        ...defaultRecord,
        attendanceid: 0,
        employee: {
          firstname: employee.firstname,
          lastname: employee.lastname
        }
      };
    });

    return allRecords;
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

// Helper function to calculate work hours
const calculateWorkhours = (checkIn: string | null, checkOut: string | null): number | null => {
  if (!checkIn || !checkOut) return null;
  
  try {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return parseFloat(diffHours.toFixed(2));
  } catch (error) {
    console.error("Error calculating work hours:", error);
    return null;
  }
};

export const updateAttendanceRecord = async (
  id: number,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord | null> => {
  try {
    console.log('Updating attendance record:', id, updates);
    
    // Map interface fields to database fields
    const dbRecord: Record<string, any> = {};
    
    if (updates.date) {
      dbRecord.status = updates.date; // Temporarily using status for date
    }
    
    if (updates.status) {
      dbRecord.status = updates.status;
    }
    
    if (updates.checkintime) {
      dbRecord.checkintimestamp = updates.date && updates.checkintime ? 
        new Date(`${updates.date}T${updates.checkintime}`).toISOString() : null;
    } else if (updates.checkintime === '') {
      dbRecord.checkintimestamp = null;
    }
    
    if (updates.checkouttime) {
      dbRecord.checkouttimestamp = updates.date && updates.checkouttime ? 
        new Date(`${updates.date}T${updates.checkouttime}`).toISOString() : null;
    } else if (updates.checkouttime === '') {
      dbRecord.checkouttimestamp = null;
    }
    
    if (updates.customerid) {
      dbRecord.customerid = updates.customerid;
    }
    
    if (updates.employeeid) {
      dbRecord.employeeid = updates.employeeid;
    }
    
    console.log('Sending to Supabase:', dbRecord);

    // If the ID is 0, it means this is a default record not yet in the database
    if (id === 0) {
      console.log('Creating new attendance record');
      
      // Get the current user's profile to set customerid for new records
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('customer_id')
          .eq('id', userData.user.id)
          .single();
          
        if (profileData?.customer_id) {
          dbRecord.customerid = profileData.customer_id;
        }
      }
      
      const { data, error: insertError } = await supabase
        .from('attendance')
        .insert(dbRecord)
        .select('*, employee:employee(firstname, lastname)')
        .single();
        
      if (insertError) {
        console.error('Error inserting new attendance record:', insertError);
        toast.error('Error creating new attendance record');
        throw insertError;
      }
      
      console.log('New attendance record created successfully:', data);
      toast.success('New attendance record created successfully');
      
      // Map database response to interface format
      return {
        attendanceid: data.attendanceid || 0,
        employeeid: data.employeeid,
        date: updates.date || '',
        checkintime: data.checkintimestamp ? 
          format(new Date(data.checkintimestamp), 'HH:mm:ss') : null,
        checkouttime: data.checkouttimestamp ? 
          format(new Date(data.checkouttimestamp), 'HH:mm:ss') : null,
        workhours: calculateWorkhours(data.checkintimestamp, data.checkouttimestamp),
        location: null,
        notes: data.notes || null,
        status: data.status || null,
        employee: data.employee,
        customerid: data.customerid
      };
    }

    const { data, error } = await supabase
      .from('attendance')
      .update(dbRecord)
      .eq('attendanceid', id)
      .select('*, employee:employee(firstname, lastname)')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      toast.error('Error updating attendance record');
      throw error;
    }

    toast.success('Attendance record updated successfully');
    
    // Map database response to interface format
    return {
      attendanceid: data.attendanceid || 0,
      employeeid: data.employeeid,
      date: updates.date || '',
      checkintime: data.checkintimestamp ? 
        format(new Date(data.checkintimestamp), 'HH:mm:ss') : null,
      checkouttime: data.checkouttimestamp ? 
        format(new Date(data.checkouttimestamp), 'HH:mm:ss') : null,
      workhours: calculateWorkhours(data.checkintimestamp, data.checkouttimestamp),
      location: null,
      notes: data.notes || null,
      status: data.status || null,
      employee: data.employee,
      customerid: data.customerid
    };
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    toast.error('Failed to update attendance record');
    return null;
  }
};

export const insertDefaultAbsentRecord = async (employeeId: number, date: string): Promise<void> => {
  try {
    // Get the current user's profile to set customerid for new records
    const { data: userData } = await supabase.auth.getUser();
    let customerid = null;
    
    if (userData?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('customer_id')
        .eq('id', userData.user.id)
        .single();
        
      if (profileData?.customer_id) {
        customerid = profileData.customer_id;
      }
    }
    
    const absentRecord = markAsAbsent(employeeId, date);
    
    // Map interface fields to database fields
    const dbRecord = {
      employeeid: absentRecord.employeeid,
      status: absentRecord.status,
      customerid
    };

    const { error } = await supabase
      .from('attendance')
      .insert([dbRecord]);

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
