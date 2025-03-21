
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useEmployees = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId } = useAuth();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('*')
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error fetching employees',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchEmployee = async (employeeId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee')
        .select(`
          *,
          department:department(departmentname)
        `)
        .eq('employeeid', employeeId)
        .eq('customerid', customerId)
        .single();

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      toast({
        title: 'Error fetching employee',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const addEmployee = async (employeeData: any) => {
    setLoading(true);
    try {
      // Add customerid to the employee data
      const newEmployeeData = {
        ...employeeData,
        customerid: customerId
      };

      const { data, error } = await supabase
        .from('employee')
        .insert(newEmployeeData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Employee added',
        description: 'Employee has been successfully added',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast({
        title: 'Error adding employee',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateEmployee = async (employeeId: number, employeeData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee')
        .update(employeeData)
        .eq('employeeid', employeeId)
        .eq('customerid', customerId)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Employee updated',
        description: 'Employee has been successfully updated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Error updating employee',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const deleteEmployee = async (employeeId: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employee')
        .delete()
        .eq('employeeid', employeeId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Employee deleted',
        description: 'Employee has been successfully deleted',
      });
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Error deleting employee',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    fetchEmployees,
    fetchEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
