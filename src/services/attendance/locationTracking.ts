
import { supabase } from "@/integrations/supabase/client";

// Track employee location
export const trackEmployeeLocation = async (
  employeeId: number,
  customerId: number,
  latitude: number,
  longitude: number
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('track')
      .insert({
        employeeid: employeeId,
        customerid: customerId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking employee location:', error);
    throw error;
  }
};

// Get office locations for geofencing
export const getOfficeLocations = async (customerId: number): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('officelocation')
      .select('*')
      .eq('customerid', customerId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching office locations:', error);
    throw error;
  }
};

// Add or update office location
export const upsertOfficeLocation = async (
  customerId: number,
  location: {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
  }
): Promise<any> => {
  try {
    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude,
      premisesradius: location.radius,
      customerid: customerId
    };
    
    if (location.id) {
      // Update existing location
      const { data, error } = await supabase
        .from('officelocation')
        .update(locationData)
        .eq('officelocationid', location.id)
        .select();
      
      if (error) throw error;
      return data;
    } else {
      // Create new location
      const { data, error } = await supabase
        .from('officelocation')
        .insert(locationData)
        .select();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating office location:', error);
    throw error;
  }
};
