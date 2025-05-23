
import { supabase } from '@/integrations/supabase/client';

export interface LocationRecord {
  track_id: string;
  employeeid: string;
  customerid: string;
  coordinates: number[];
  timestamp: string;
}

export const getLocationRecords = async (customerId?: string): Promise<LocationRecord[]> => {
  try {
    let query = supabase
      .from('track')
      .select('*');
    
    if (customerId) {
      query = query.eq('customerid', customerId);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching location records:', error);
      throw error;
    }

    return (data || []) as LocationRecord[];
  } catch (error) {
    console.error('Error in getLocationRecords:', error);
    throw error;
  }
};

export const getLocationByEmployeeId = async (employeeId: string): Promise<LocationRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('track')
      .select('*')
      .eq('employeeid', employeeId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching location by employee ID:', error);
      throw error;
    }

    return (data || []) as LocationRecord[];
  } catch (error) {
    console.error('Error in getLocationByEmployeeId:', error);
    throw error;
  }
};

export const createLocationRecord = async (record: Omit<LocationRecord, 'track_id'>): Promise<LocationRecord> => {
  try {
    const recordToInsert = {
      employeeid: record.employeeid,
      customerid: record.customerid,
      coordinates: record.coordinates,
      timestamp: record.timestamp
    };

    const { data, error } = await supabase
      .from('track')
      .insert(recordToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating location record:', error);
      throw error;
    }

    return data as LocationRecord;
  } catch (error) {
    console.error('Error in createLocationRecord:', error);
    throw error;
  }
};

export const updateLocationRecord = async (trackId: string, updates: Partial<LocationRecord>): Promise<LocationRecord> => {
  try {
    const { data, error } = await supabase
      .from('track')
      .update(updates)
      .eq('track_id', trackId)
      .select()
      .single();

    if (error) {
      console.error('Error updating location record:', error);
      throw error;
    }

    return data as LocationRecord;
  } catch (error) {
    console.error('Error in updateLocationRecord:', error);
    throw error;
  }
};

export const deleteLocationRecord = async (trackId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('track')
      .delete()
      .eq('track_id', trackId);

    if (error) {
      console.error('Error deleting location record:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteLocationRecord:', error);
    throw error;
  }
};
