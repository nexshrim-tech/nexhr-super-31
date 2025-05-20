
import { supabase } from "@/integrations/supabase/client";

// Type definition for attendance settings
export interface AttendanceSettings {
  attendancesettingid: string;
  employee_id: string;
  customerid: string;
  workstarttime?: string;
  latethreshold?: string;
  geofencingenabled?: boolean;
  photoverificationenabled?: boolean;
}

export async function getAttendanceSettings(employeeId: string): Promise<AttendanceSettings | null> {
  const { data, error } = await supabase
    .from('attendancesettings')
    .select('*')
    .eq('employee_id', employeeId)
    .single();

  if (error) {
    console.error('Error fetching attendance settings:', error);
    return null;
  }

  return data as AttendanceSettings;
}

export async function updateAttendanceSetting(
  attendanceSettingId: string,
  updates: Partial<Omit<AttendanceSettings, 'attendancesettingid' | 'employee_id' | 'customerid'>>
): Promise<AttendanceSettings | null> {
  const { data, error } = await supabase
    .from('attendancesettings')
    .update(updates)
    .eq('attendancesettingid', attendanceSettingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendance setting:', error);
    return null;
  }

  return data;
}

export async function createAttendanceSetting(
  newSetting: Omit<AttendanceSettings, 'attendancesettingid'>
): Promise<AttendanceSettings | null> {
  const { data, error } = await supabase
    .from('attendancesettings')
    .insert([newSetting])
    .select()
    .single();

  if (error) {
    console.error('Error creating attendance setting:', error);
    return null;
  }

  return data;
}

export { updateAttendanceSetting as updateAttendanceSettings, createAttendanceSetting as createAttendanceSettings };
