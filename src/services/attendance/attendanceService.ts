import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Fix for TS2589 error - removing excessive type recursion
type AttendanceRecord = {
  employeeid: number | null;
  customerid: number | null;
  checkintimestamp: string | null;
  checkouttimestamp: string | null;
  status: string | null;
  selfieimagepath: string | null;
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

export const createAttendanceRecord = async (record: AttendanceRecord) => {
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

export const updateAttendanceRecord = async (id: number, updates: Partial<AttendanceRecord>) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .update(updates)
      .eq("id", id)
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
      .eq("id", id);

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

// Fix the type issue in getAllAttendance
export const getAllAttendance = async () => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*");

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
