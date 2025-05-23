
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface LocationData {
  employeeid: string;
  customerid: string;
  coordinates: number[];
  timestamp: string;
  track_id?: string;
}

export const saveLocationData = async (locationData: LocationData): Promise<void> => {
  try {
    // Generate track_id if not provided
    const dataToInsert = {
      ...locationData,
      track_id: locationData.track_id || uuidv4()
    };

    const { error } = await supabase
      .from('track')
      .insert([dataToInsert]); // Wrap in array to satisfy TypeScript

    if (error) {
      console.error('Error saving location data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in saveLocationData:', error);
    throw error;
  }
};

export const getLocationData = async (employeeid?: string, customerId?: string): Promise<LocationData[]> => {
  try {
    let query = supabase
      .from('track')
      .select('*');
    
    if (employeeid) {
      query = query.eq('employeeid', employeeid);
    }
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }

    return (data || []) as LocationData[];
  } catch (error) {
    console.error('Error in getLocationData:', error);
    throw error;
  }
};

export const getLatestLocationForEmployee = async (employeeid: string): Promise<LocationData | null> => {
  try {
    const { data, error } = await supabase
      .from('track')
      .select('*')
      .eq('employeeid', employeeid)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest location:', error);
      return null;
    }

    return data as LocationData;
  } catch (error) {
    console.error('Error in getLatestLocationForEmployee:', error);
    return null;
  }
};

export const deleteLocationData = async (track_id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('track')
      .delete()
      .eq('track_id', track_id);

    if (error) {
      console.error('Error deleting location data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteLocationData:', error);
    throw error;
  }
};
