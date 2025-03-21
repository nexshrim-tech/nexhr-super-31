
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useSalary = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId } = useAuth();

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary')
        .select(`
          *,
          employee:employee(employeeid, firstname, lastname, jobtitle, department)
        `)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching salaries:', error);
      toast({
        title: 'Error fetching salaries',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchEmployeeSalary = async (employeeId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary')
        .select(`
          *,
          employee:employee(employeeid, firstname, lastname, jobtitle, department)
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
      console.error('Error fetching employee salary:', error);
      toast({
        title: 'Error fetching salary',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const addSalary = async (salaryData: any) => {
    setLoading(true);
    try {
      // Add customerid to the salary data
      const newSalaryData = {
        ...salaryData,
        customerid: customerId
      };

      const { data, error } = await supabase
        .from('salary')
        .insert(newSalaryData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Salary added',
        description: 'Salary has been successfully added',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error adding salary:', error);
      toast({
        title: 'Error adding salary',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateSalary = async (salaryId: number, salaryData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary')
        .update(salaryData)
        .eq('salaryid', salaryId)
        .eq('customerid', customerId)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Salary updated',
        description: 'Salary has been successfully updated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating salary:', error);
      toast({
        title: 'Error updating salary',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const generatePayslip = async (employeeId: number, month: number, year: number, amount: number) => {
    setLoading(true);
    try {
      const payslipData = {
        employeeid: employeeId,
        customerid: customerId,
        month,
        year,
        amount,
        generatedtimestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('payslip')
        .insert(payslipData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Payslip generated',
        description: 'Payslip has been successfully generated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error generating payslip:', error);
      toast({
        title: 'Error generating payslip',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const fetchPayslips = async (employeeId?: number) => {
    setLoading(true);
    try {
      let query = supabase
        .from('payslip')
        .select(`
          *,
          employee:employee(firstname, lastname, jobtitle)
        `)
        .eq('customerid', customerId);
      
      if (employeeId) {
        query = query.eq('employeeid', employeeId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching payslips:', error);
      toast({
        title: 'Error fetching payslips',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  return {
    loading,
    fetchSalaries,
    fetchEmployeeSalary,
    addSalary,
    updateSalary,
    generatePayslip,
    fetchPayslips
  };
};
