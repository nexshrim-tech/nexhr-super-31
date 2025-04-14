
import { supabase } from '@/integrations/supabase/client';

// Define AttendanceSettings interface
export interface AttendanceSettings {
  id?: number;
  customerid: number;
  workstarttime: string;
  workendtime: string;
  latethreshold: string;
  geofencingenabled: boolean;
  photoverificationenabled: boolean;
  created_at?: string;
}

// Mock default settings
const defaultSettings: AttendanceSettings = {
  customerid: 1,
  workstarttime: '09:00:00',
  workendtime: '17:00:00',
  latethreshold: '15',
  geofencingenabled: false,
  photoverificationenabled: false
};

// Get all attendance settings for a customer
export const getAttendanceSettings = async (customerId?: number): Promise<AttendanceSettings[]> => {
  try {
    console.log("Fetching attendance settings for customer:", customerId);
    // Use mock data for development since the table might not exist yet
    return [{ ...defaultSettings, customerid: customerId || 1 }];
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

// Get a specific attendance setting
export const getAttendanceSetting = async (settingId: number): Promise<AttendanceSettings | null> => {
  try {
    console.log("Fetching attendance setting:", settingId);
    return { ...defaultSettings, id: settingId };
  } catch (error) {
    console.error('Error in getAttendanceSetting:', error);
    throw error;
  }
};

// Get attendance settings for a customer
export const getAttendanceSettingsByCustomerId = async (customerId: number): Promise<AttendanceSettings | null> => {
  try {
    console.log("Fetching attendance settings for customer:", customerId);
    return { ...defaultSettings, customerid: customerId };
  } catch (error) {
    console.error('Error in getAttendanceSettingsByCustomerId:', error);
    throw error;
  }
};

// Create new attendance settings
export const createAttendanceSettings = async (settings: Omit<AttendanceSettings, 'id'>): Promise<AttendanceSettings> => {
  try {
    console.log("Creating attendance settings:", settings);
    return { ...settings, id: 1 };
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};

// Update attendance settings
export const updateAttendanceSettings = async (
  settingId: number,
  settings: Partial<Omit<AttendanceSettings, 'id'>>
): Promise<AttendanceSettings> => {
  try {
    console.log("Updating attendance settings:", settingId, settings);
    return { ...defaultSettings, ...settings, id: settingId };
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};
