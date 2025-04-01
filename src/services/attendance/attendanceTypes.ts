
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

// Input types defined separately to avoid circular references
export type AttendanceInput = Omit<Attendance, 'attendanceid'>;

export type AttendanceUpdateInput = Partial<Omit<Attendance, 'attendanceid'>>;
