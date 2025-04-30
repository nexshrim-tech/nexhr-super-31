
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceRecord {
  id?: number;
  employeeid?: number;
  customerid?: number;
  checkintimestamp?: string | null;
  checkouttimestamp?: string | null;
  status?: string;
  selfieimagepath?: string | null;
  employee?: {
    firstname: string;
    lastname: string;
  };
  // Additional fields used in the components
  date?: string;
  checkintime?: string;
  checkouttime?: string;
  notes?: string;
  workhours?: number;
}

export const getAttendanceForDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    const startDate = `${date}T00:00:00`;
    const endDate = `${date}T23:59:59`;
    
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employee:employeeid (
          firstname,
          lastname
        )
      `)
      .gte('checkintimestamp', startDate)
      .lte('checkintimestamp', endDate);
    
    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAttendanceForDate:', error);
    return [];
  }
};

export const updateAttendanceRecord = async (
  employeeId: number, 
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord> => {
  try {
    // Convert time strings to timestamps if provided
    const updateData: any = { ...updates };
    
    // If checkintime is provided, update checkintimestamp
    if (updates.checkintime && updates.date) {
      updateData.checkintimestamp = `${updates.date}T${updates.checkintime}`;
      delete updateData.checkintime;
    }
    
    // If checkouttime is provided, update checkouttimestamp
    if (updates.checkouttime && updates.date) {
      updateData.checkouttimestamp = `${updates.date}T${updates.checkouttime}`;
      delete updateData.checkouttime;
    }
    
    // Remove date and notes fields that don't exist in database
    delete updateData.date;
    delete updateData.notes;
    
    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('employeeid', employeeId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateAttendanceRecord:', error);
    throw error;
  }
};
