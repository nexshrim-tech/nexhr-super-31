
import { supabase } from "@/integrations/supabase/client";

// Fetch attendance settings
export const fetchAttendanceSettings = async (customerId: number): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('attendancesettings')
      .select('*')
      .eq('customerid', customerId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Return default settings if none exist
    if (!data) {
      return {
        workstarttime: '09:00:00',
        latethreshold: 30, // 30 minutes
        geofencingenabled: true,
        photoverificationenabled: true
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching attendance settings:', error);
    throw error;
  }
};

// Update attendance settings
export const updateAttendanceSettings = async (
  customerId: number,
  settings: {
    workStartTime: string;
    lateThreshold: number;
    geofencingEnabled: boolean;
    photoVerificationEnabled: boolean;
  }
): Promise<any> => {
  try {
    // Check if settings exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('attendancesettings')
      .select('attendancesettingid')
      .eq('customerid', customerId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    const settingsData = {
      workstarttime: settings.workStartTime,
      latethreshold: `${settings.lateThreshold} minutes`,
      geofencingenabled: settings.geofencingEnabled,
      photoverificationenabled: settings.photoVerificationEnabled,
      customerid: customerId
    };
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('attendancesettings')
        .update(settingsData)
        .eq('attendancesettingid', existingSettings.attendancesettingid)
        .select();
      
      if (error) throw error;
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('attendancesettings')
        .insert(settingsData)
        .select();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating attendance settings:', error);
    throw error;
  }
};
