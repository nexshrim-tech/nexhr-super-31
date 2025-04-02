
import { supabase } from '@/integrations/supabase/client';
import { Attendance, CreateAttendanceDto, UpdateAttendanceDto } from './attendanceTypes';

/**
 * Get attendance records with optional filtering
 */
export async function getAttendance(
  employeeId?: number, 
  startDate?: string, 
  endDate?: string
): Promise<Attendance[]> {
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

  return data as Attendance[] || [];
}

/**
 * Get a single attendance record by ID
 */
export async function getAttendanceById(id: number): Promise<Attendance | null> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendanceid', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching attendance by ID:', error);
    throw error;
  }

  return data as Attendance;
}

/**
 * Create a new attendance record
 */
export async function addAttendance(attendance: CreateAttendanceDto): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .insert([attendance])
    .select();

  if (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }

  return data[0] as Attendance;
}

/**
 * Update an existing attendance record
 */
export async function updateAttendance(
  id: number, 
  attendance: UpdateAttendanceDto
): Promise<Attendance> {
  const { data, error } = await supabase
    .from('attendance')
    .update(attendance)
    .eq('attendanceid', id)
    .select();

  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }

  return data[0] as Attendance;
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
