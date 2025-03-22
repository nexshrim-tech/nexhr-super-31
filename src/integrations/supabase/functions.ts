
import { supabase } from "@/integrations/supabase/client";

// User and Authentication Functions
export const createProfile = async (userId: string, role: string = 'employee') => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: role
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const createCustomer = async (
  companyName: string, 
  email: string, 
  companySize: string,
  phoneNumber: string,
  planId: number = 1
) => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .insert({
        name: companyName,
        email: email,
        planid: planId,
        companysize: companySize,
        phonenumber: phoneNumber
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateProfileWithCustomerId = async (userId: string, customerId: number) => {
  try {
    const { data, error } = await supabase.rpc(
      'update_profile_customer',
      { 
        user_id: userId, 
        customer_id_param: customerId 
      }
    );
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile with customer ID:', error);
    throw error;
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Asset Management Functions
export const fetchAssets = async () => {
  try {
    const { data, error } = await supabase
      .from('assetmanagement')
      .select(`
        assetid,
        assetname,
        assettype,
        serialnumber,
        assetstatus,
        assetvalue,
        purchasedate,
        billpath,
        customerid,
        employeeid,
        employee:employeeid (
          employeeid,
          firstname,
          lastname
        )
      `);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const createAsset = async (assetData: any) => {
  try {
    const { data, error } = await supabase
      .from('assetmanagement')
      .insert(assetData)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

export const updateAsset = async (assetId: number, assetData: any) => {
  try {
    const { data, error } = await supabase
      .from('assetmanagement')
      .update(assetData)
      .eq('assetid', assetId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

export const deleteAsset = async (assetId: number) => {
  try {
    const { error } = await supabase
      .from('assetmanagement')
      .delete()
      .eq('assetid', assetId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

export const uploadAssetBill = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('asset-bills')
      .upload(path, file);
    
    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading asset bill:', error);
    throw error;
  }
};

export const getAssetBillUrl = async (path: string) => {
  try {
    const { data } = await supabase.storage
      .from('asset-bills')
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting asset bill URL:', error);
    throw error;
  }
};
