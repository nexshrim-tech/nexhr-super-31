
import { supabase } from './client';

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.name?.split(' ')[0] || '',
        last_name: userData.name?.split(' ').slice(1).join(' ') || '',
        role: 'employee',
        company_name: userData.companyName,
        phone_number: userData.phoneNumber,
        company_size: userData.companySize
      }
    }
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Database functions for seamless data access
export const getEmployeeLocations = async () => {
  const { data, error } = await supabase
    .from('track')
    .select(`
      trackid,
      latitude,
      longitude,
      timestamp,
      employeeid,
      employee:employeeid (
        firstname,
        lastname
      )
    `)
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateEmployeeLocation = async (employeeId: number, latitude: number, longitude: number) => {
  const { error } = await supabase
    .from('track')
    .insert([
      {
        employeeid: employeeId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      }
    ]);
  
  if (error) throw error;
};

export const getCurrentCustomerId = async () => {
  const { data, error } = await supabase.rpc('get_current_customer_id');
  if (error) throw error;
  return data;
};

export const getEmployeeDetails = async (employeeId: number) => {
  const { data, error } = await supabase
    .from('employee')
    .select('*')
    .eq('employeeid', employeeId)
    .single();
  
  if (error) throw error;
  return data;
};
