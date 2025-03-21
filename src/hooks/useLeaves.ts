
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useLeaves = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId, employeeId } = useAuth();

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave')
        .select(`
          *,
          employee:employee(firstname, lastname, profilepicturepath)
        `)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching leaves:', error);
      toast({
        title: 'Error fetching leaves',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchMyLeaves = async () => {
    if (!employeeId) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave')
        .select('*')
        .eq('employeeid', employeeId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching my leaves:', error);
      toast({
        title: 'Error fetching leaves',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const applyLeave = async (leaveData: any) => {
    if (!employeeId) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to apply for leave',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    try {
      // Fetch employee name for record
      const { data: employeeData } = await supabase
        .from('employee')
        .select('firstname, lastname')
        .eq('employeeid', employeeId)
        .single();

      const employeeName = employeeData ? 
        `${employeeData.firstname} ${employeeData.lastname}` : 
        'Employee';

      // Add customerid and employeeid to the leave data
      const newLeaveData = {
        ...leaveData,
        customerid: customerId,
        employeeid: employeeId,
        employeename: employeeName
      };

      const { data, error } = await supabase
        .from('leave')
        .insert(newLeaveData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Leave applied',
        description: 'Your leave application has been submitted',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error applying leave:', error);
      toast({
        title: 'Error applying leave',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateLeaveStatus = async (leaveId: number, statusValue: string) => {
    setLoading(true);
    try {
      // The leave table might not have a status column in the type definition
      // but it seems to exist in the actual database
      // Let's use a type assertion to bypass the type check
      const updateData: any = { status: statusValue };
      
      const { data, error } = await supabase
        .from('leave')
        .update(updateData)
        .eq('leaveid', leaveId)
        .eq('customerid', customerId)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Leave status updated',
        description: `Leave application has been ${statusValue.toLowerCase()}`,
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating leave status:', error);
      toast({
        title: 'Error updating leave',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const cancelLeave = async (leaveId: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leave')
        .delete()
        .eq('leaveid', leaveId)
        .eq('employeeid', employeeId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Leave cancelled',
        description: 'Your leave application has been cancelled',
      });
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error cancelling leave:', error);
      toast({
        title: 'Error cancelling leave',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    fetchLeaves,
    fetchMyLeaves,
    applyLeave,
    updateLeaveStatus,
    cancelLeave
  };
};
