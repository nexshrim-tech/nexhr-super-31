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

// Department Management Functions
export const fetchDepartments = async (customerId: number) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .select(`
        departmentid,
        departmentname,
        managerid,
        employeecount,
        annualbudget,
        status,
        customerid
      `)
      .eq('customerid', customerId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const createDepartment = async (departmentData: {
  departmentname: string;
  managerid: number;
  employeecount: number;
  annualbudget: number;
  status: string;
  customerid: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .insert(departmentData)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (departmentId: number, departmentData: {
  departmentname?: string;
  managerid?: number;
  employeecount?: number;
  annualbudget?: number;
  status?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update(departmentData)
      .eq('departmentid', departmentId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (departmentId: number) => {
  try {
    const { error } = await supabase
      .from('department')
      .delete()
      .eq('departmentid', departmentId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Project Management Functions
export const fetchProjects = async (customerId: number) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        projectid,
        projectname,
        projectdescription,
        projectstatus,
        priority,
        duedate,
        customerid
      `)
      .eq('customerid', customerId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectAssignments = async (projectId: number) => {
  try {
    const { data, error } = await supabase
      .from('project_assignments')
      .select(`
        assignment_id,
        projectid,
        employeeid,
        employee:employeeid (
          employeeid,
          firstname,
          lastname
        )
      `)
      .eq('projectid', projectId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching project assignments:', error);
    throw error;
  }
};

export const createProject = async (projectData: {
  projectname: string;
  projectdescription: string;
  projectstatus: string;
  priority: string;
  duedate: string;
  customerid: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId: number, projectData: {
  projectname?: string;
  projectdescription?: string;
  projectstatus?: string;
  priority?: string;
  duedate?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('projectid', projectId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('projectid', projectId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const addProjectAssignment = async (assignmentData: {
  projectid: number;
  employeeid: number;
  customerid: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('project_assignments')
      .insert(assignmentData)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding project assignment:', error);
    throw error;
  }
};

export const removeProjectAssignment = async (assignmentId: number) => {
  try {
    const { error } = await supabase
      .from('project_assignments')
      .delete()
      .eq('assignment_id', assignmentId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing project assignment:', error);
    throw error;
  }
};

// Employee fetching for departments and projects
export const fetchEmployees = async (customerId: number) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        employeeid,
        firstname,
        lastname,
        email,
        jobtitle
      `)
      .eq('customerid', customerId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};
