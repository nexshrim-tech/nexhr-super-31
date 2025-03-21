
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useDepartments = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId } = useAuth();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('department')
        .select(`
          *,
          manager:employee(firstname, lastname, profilepicturepath)
        `)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error fetching departments',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchDepartment = async (departmentId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('department')
        .select(`
          *,
          manager:employee(firstname, lastname, profilepicturepath)
        `)
        .eq('departmentid', departmentId)
        .eq('customerid', customerId)
        .single();

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching department:', error);
      toast({
        title: 'Error fetching department',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const addDepartment = async (departmentData: any) => {
    setLoading(true);
    try {
      // Add customerid to the department data
      const newDepartmentData = {
        ...departmentData,
        customerid: customerId
      };

      const { data, error } = await supabase
        .from('department')
        .insert(newDepartmentData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Department added',
        description: 'Department has been successfully added',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error adding department:', error);
      toast({
        title: 'Error adding department',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateDepartment = async (departmentId: number, departmentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('department')
        .update(departmentData)
        .eq('departmentid', departmentId)
        .eq('customerid', customerId)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Department updated',
        description: 'Department has been successfully updated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast({
        title: 'Error updating department',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const deleteDepartment = async (departmentId: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('department')
        .delete()
        .eq('departmentid', departmentId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Department deleted',
        description: 'Department has been successfully deleted',
      });
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast({
        title: 'Error deleting department',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    fetchDepartments,
    fetchDepartment,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
