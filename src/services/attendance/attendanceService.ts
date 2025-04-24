
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Define a more complete AttendanceRecord type that includes all fields used in the components
export type AttendanceRecord = {
  attendanceid?: number;
  employeeid: number | null;
  customerid: number | null;
  date?: string;
  checkintime?: string | null;
  checkouttime?: string | null;
  checkintimestamp?: string | null;
  checkouttimestamp?: string | null;
  status: string | null;
  selfieimagepath?: string | null;
  notes?: string | null;
  workhours?: number | null;
  employee?: {
    firstname?: string | null;
    lastname?: string | null;
  };
};

export const getAttendanceByCustomerId = async (customerId: number) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("customerid", customerId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching attendance by customer ID:", error.message);
    toast({
      title: "Failed to fetch attendance",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getAttendanceByEmployeeId = async (employeeId: number) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employeeid", employeeId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching attendance by employee ID:", error.message);
    toast({
      title: "Failed to fetch attendance",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const createAttendanceRecord = async (record: Partial<AttendanceRecord>) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .insert([record])
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error: any) {
    console.error("Error creating attendance record:", error.message);
    toast({
      title: "Failed to create attendance record",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Fix the update function to remove circular reference
export const updateAttendanceRecord = async (id: number, updates: Partial<Omit<AttendanceRecord, 'employee'>>) => {
  try {
    // Extract relevant fields to avoid sending extraneous data
    const { attendanceid, ...cleanUpdates } = updates;
    
    const { data, error } = await supabase
      .from("attendance")
      .update(cleanUpdates)
      .eq("attendanceid", id)
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error: any) {
    console.error("Error updating attendance record:", error.message);
    toast({
      title: "Failed to update attendance record",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteAttendanceRecord = async (id: number) => {
  try {
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("attendanceid", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting attendance record:", error.message);
    toast({
      title: "Failed to delete attendance record",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const getAllAttendance = async () => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*, employee(firstname, lastname)");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching all attendance:", error.message);
    toast({
      title: "Failed to fetch attendance",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Fix getAttendanceForDate to properly handle date filtering
export const getAttendanceForDate = async (dateString: string) => {
  try {
    console.log("Fetching attendance for date:", dateString);
    
    // Get all attendance records with employee information
    const { data, error } = await supabase
      .from("attendance")
      .select("*, employee(firstname, lastname)");

    if (error) {
      throw error;
    }

    // Map the data to include the date property for filtering
    const attendanceWithDate = data?.map(record => {
      // Extract the date from checkintimestamp if exists
      const date = record.checkintimestamp ? 
        format(new Date(record.checkintimestamp), 'yyyy-MM-dd') : 
        dateString; // Fallback to requested date if no timestamp
      
      return {
        ...record,
        date
      };
    }) || [];
    
    // Filter by the requested date
    const filteredData = attendanceWithDate.filter(record => 
      record.date === dateString
    );
    
    console.log("Attendance data received:", filteredData);
    return filteredData;
  } catch (error: any) {
    console.error("Error fetching attendance for date:", dateString, error.message);
    toast({
      title: "Failed to fetch attendance",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};
