
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceSettings {
  attendancesettingid?: number;
  customerid?: number;
  employeeid?: number;
  geofencingenabled: boolean;
  latethreshold: string;  // Using string type for latethreshold
  photoverificationenabled: boolean;
  workstarttime: string;
}

// Mock function until database schema is updated
export const getAttendanceSettings = async (employeeId?: number): Promise<AttendanceSettings[]> => {
  try {
    // Mock data
    const mockSettings: AttendanceSettings[] = [
      {
        attendancesettingid: 1,
        customerid: 1,
        employeeid: employeeId,
        geofencingenabled: true,
        latethreshold: "15",  // 15 minutes
        photoverificationenabled: true,
        workstarttime: "09:00"
      }
    ];
    
    return mockSettings;
  } catch (error) {
    console.error('Error in getAttendanceSettings:', error);
    throw error;
  }
};

export const updateAttendanceSettings = async (
  id: number, 
  settings: Partial<Omit<AttendanceSettings, 'attendancesettingid'>>
): Promise<AttendanceSettings> => {
  try {
    // Mock implementation
    const updatedSettings: AttendanceSettings = {
      attendancesettingid: id,
      geofencingenabled: settings.geofencingenabled !== undefined ? settings.geofencingenabled : true,
      latethreshold: settings.latethreshold || "15",
      photoverificationenabled: settings.photoverificationenabled !== undefined ? settings.photoverificationenabled : true,
      workstarttime: settings.workstarttime || "09:00",
      customerid: settings.customerid,
      employeeid: settings.employeeid
    };
    
    return updatedSettings;
  } catch (error) {
    console.error('Error in updateAttendanceSettings:', error);
    throw error;
  }
};

export const createAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>
): Promise<AttendanceSettings> => {
  try {
    // Mock implementation
    const newSettings: AttendanceSettings = {
      ...settings,
      attendancesettingid: Math.floor(Math.random() * 1000)
    };
    
    return newSettings;
  } catch (error) {
    console.error('Error in createAttendanceSettings:', error);
    throw error;
  }
};

export const bulkCreateAttendanceSettings = async (
  settings: Omit<AttendanceSettings, 'attendancesettingid'>[]
): Promise<AttendanceSettings[]> => {
  try {
    // Mock implementation
    const createdSettings: AttendanceSettings[] = settings.map((setting, index) => ({
      ...setting,
      attendancesettingid: Math.floor(Math.random() * 1000) + index
    }));
    
    return createdSettings;
  } catch (error) {
    console.error('Error in bulkCreateAttendanceSettings:', error);
    throw error;
  }
};
