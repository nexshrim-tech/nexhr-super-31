
import { supabase } from "@/integrations/supabase/client";

export interface Asset {
  assetid: number;
  assetname: string;
  assettype: string;
  serialnumber: string;
  assetstatus: string;
  assetvalue: number;
  purchasedate: string;
  billpath?: string;
  customerid: number;
  employeeid?: number;
  employee?: {
    employeeid: number;
    firstname: string;
    lastname: string;
  };
}

export interface AssetFormData {
  assetname: string;
  assettype: string;
  serialnumber: string;
  purchasedate: string;
  assetvalue: string;
  assignedTo: string | null;
  assetstatus: string;
  billFile?: File | null;
}

// Convert database asset to frontend format
export const mapAssetForFrontend = (asset: Asset) => {
  return {
    id: asset.assetid,
    name: asset.assetname,
    type: asset.assettype,
    serialNumber: asset.serialnumber,
    status: asset.assetstatus,
    value: asset.assetvalue,
    purchaseDate: asset.purchasedate,
    assignedTo: asset.employee ? {
      name: `${asset.employee.firstname} ${asset.employee.lastname}`,
      avatar: `${asset.employee.firstname[0]}${asset.employee.lastname[0]}`
    } : null,
    bill: asset.billpath
  };
};

// Convert frontend data to database format
export const mapAssetForDatabase = (formData: AssetFormData, customerId: number): Omit<Asset, 'assetid'> => {
  return {
    assetname: formData.assetname,
    assettype: formData.assettype,
    serialnumber: formData.serialnumber,
    assetstatus: formData.assetstatus,
    assetvalue: parseFloat(formData.assetvalue),
    purchasedate: formData.purchasedate,
    customerid: customerId,
    employeeid: formData.assignedTo ? parseInt(formData.assignedTo) : null
  };
};

// Fetch all assets for current customer
export const fetchAssets = async (): Promise<Asset[]> => {
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
    return data || [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Create a new asset
export const createAsset = async (assetData: Omit<Asset, 'assetid'>, billFile?: File): Promise<Asset> => {
  try {
    // If there's a bill file, upload it first
    let billPath = null;
    if (billFile) {
      const fileName = `${Date.now()}-${billFile.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('asset-bills')
        .upload(fileName, billFile);
      
      if (fileError) throw fileError;
      billPath = fileName;
    }

    // Create the asset with the bill path
    const dataToInsert = {
      ...assetData,
      billpath: billPath
    };

    // Now create the asset
    const { data, error } = await supabase
      .from('assetmanagement')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

// Update an existing asset
export const updateAsset = async (assetId: number, assetData: Partial<Asset>, billFile?: File): Promise<Asset> => {
  try {
    // If there's a new bill file, upload it first
    let billPath = assetData.billpath;
    if (billFile) {
      const fileName = `${Date.now()}-${billFile.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('asset-bills')
        .upload(fileName, billFile);
      
      if (fileError) throw fileError;
      billPath = fileName;
    }

    // Prepare update data
    const updateData = {
      ...assetData,
      billpath: billPath
    };

    // Update the asset
    const { data, error } = await supabase
      .from('assetmanagement')
      .update(updateData)
      .eq('assetid', assetId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

// Delete an asset
export const deleteAsset = async (assetId: number): Promise<boolean> => {
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

// Get the URL for an asset bill
export const getAssetBillUrl = async (path: string): Promise<string> => {
  try {
    if (!path) return '';
    
    const { data } = await supabase.storage
      .from('asset-bills')
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting asset bill URL:', error);
    return '';
  }
};

// Fetch all employees for asset assignment
export const fetchEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select('employeeid, firstname, lastname')
      .order('firstname');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Get customer ID for current user
export const getCurrentCustomerId = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase.rpc('get_current_customer_id');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting current customer ID:', error);
    return null;
  }
};
