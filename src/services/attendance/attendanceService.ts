
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
