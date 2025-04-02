
import { supabase } from '@/integrations/supabase/client';

/**
 * Simplified interface for attendance records
 */
export interface AttendanceRecord {
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

// Simple type aliases instead of complex nested types
export type CreateAttendanceRecord = Omit<AttendanceRecord, 'attendanceid'>;
export type UpdateAttendanceRecord = Partial<AttendanceRecord>;

/**
 * Get attendance records with optional filtering
 */
export async function getAttendance(
  employeeId?: number, 
  startDate?: string, 
  endDate?: string
): Promise<AttendanceRecord[]> {
  let query = supabase
    .from('attendance')
    .select('*');
  
  if (employeeId) {
    query = query.eq('employeeid', employeeId);
  }
  
  if (startDate) {
    query = query.gte('checkintimestamp', startDate);
  }
  
  if (endDate) {
    query = query.lte('checkintimestamp', endDate);
  }
  
  const { data, error } = await query.order('checkintimestamp', { ascending: false });

  if (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single attendance record by ID
 */
export async function getAttendanceById(id: number): Promise<AttendanceRecord | null> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendanceid', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching attendance by ID:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new attendance record
 */
export async function createAttendance(record: CreateAttendanceRecord): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance')
    .insert([record])
    .select();

  if (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }

  return data[0];
}

/**
 * Update an existing attendance record
 */
export async function updateAttendance(
  id: number, 
  updates: UpdateAttendanceRecord
): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance')
    .update(updates)
    .eq('attendanceid', id)
    .select();

  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }

  return data[0];
}

/**
 * Delete an attendance record
 */
export async function deleteAttendance(id: number): Promise<void> {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('attendanceid', id);

  if (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
}
