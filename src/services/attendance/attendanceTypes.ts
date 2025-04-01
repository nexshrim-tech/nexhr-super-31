
import { supabase } from '@/integrations/supabase/client';

export interface Attendance {
  attendanceid?: number;
  employeeid: number;
  attendancedate?: string;
  status: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  customerid?: number;
  selfieimagepath?: string;
}

// Define separate input types to avoid type circularity
export type AttendanceInput = Omit<Attendance, 'attendanceid'>;

export type AttendanceUpdateInput = {
  employeeid?: number;
  attendancedate?: string;
  status?: string;
  notes?: string;
  latitude?: string;
  longitude?: string;
  checkintimestamp?: string;
  checkouttimestamp?: string;
  customerid?: number;
  selfieimagepath?: string;
};
