
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId, employeeId } = useAuth();

  const fetchAttendance = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          employee:employee(firstname, lastname, profilepicturepath)
        `)
        .eq('customerid', customerId);
      
      if (startDate) {
        query = query.gte('checkintimestamp', startDate);
      }
      
      if (endDate) {
        query = query.lte('checkintimestamp', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Error fetching attendance',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchMyAttendance = async (startDate?: string, endDate?: string) => {
    if (!employeeId) return [];
    
    setLoading(true);
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('employeeid', employeeId)
        .eq('customerid', customerId);
      
      if (startDate) {
        query = query.gte('checkintimestamp', startDate);
      }
      
      if (endDate) {
        query = query.lte('checkintimestamp', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching my attendance:', error);
      toast({
        title: 'Error fetching attendance',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const checkIn = async (selfieImagePath: string | null = null) => {
    if (!employeeId) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to check in',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    try {
      // Check if already checked in today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingRecord, error: checkError } = await supabase
        .from('attendance')
        .select('*')
        .eq('employeeid', employeeId)
        .gte('checkintimestamp', today)
        .lt('checkintimestamp', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingRecord && existingRecord.length > 0) {
        toast({
          title: 'Already checked in',
          description: 'You have already checked in today',
          variant: 'destructive',
        });
        setLoading(false);
        return null;
      }

      // Proceed with check in
      const checkInData = {
        employeeid: employeeId,
        customerid: customerId,
        checkintimestamp: new Date().toISOString(),
        selfieimagepath: selfieImagePath,
        status: 'Present'
      };

      const { data, error } = await supabase
        .from('attendance')
        .insert(checkInData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Checked in',
        description: 'You have successfully checked in',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast({
        title: 'Error checking in',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const checkOut = async () => {
    if (!employeeId) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to check out',
        variant: 'destructive',
      });
      return null;
    }
    
    setLoading(true);
    try {
      // Find today's check in record
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingRecord, error: checkError } = await supabase
        .from('attendance')
        .select('*')
        .eq('employeeid', employeeId)
        .gte('checkintimestamp', today)
        .lt('checkintimestamp', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0])
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      if (!existingRecord) {
        toast({
          title: 'No check in record',
          description: 'You need to check in before checking out',
          variant: 'destructive',
        });
        setLoading(false);
        return null;
      }
      
      if (existingRecord.checkouttimestamp) {
        toast({
          title: 'Already checked out',
          description: 'You have already checked out today',
          variant: 'destructive',
        });
        setLoading(false);
        return null;
      }

      // Proceed with check out
      const { data, error } = await supabase
        .from('attendance')
        .update({
          checkouttimestamp: new Date().toISOString()
        })
        .eq('employeeid', employeeId)
        .eq('checkintimestamp', existingRecord.checkintimestamp)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Checked out',
        description: 'You have successfully checked out',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error checking out:', error);
      toast({
        title: 'Error checking out',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateAttendanceStatus = async (employeeId: number, date: string, status: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update({ status })
        .eq('employeeid', employeeId)
        .eq('customerid', customerId)
        .gte('checkintimestamp', date)
        .lt('checkintimestamp', new Date(new Date(date).setDate(new Date(date).getDate() + 1)).toISOString())
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Attendance updated',
        description: 'Attendance status has been updated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      toast({
        title: 'Error updating attendance',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    fetchAttendance,
    fetchMyAttendance,
    checkIn,
    checkOut,
    updateAttendanceStatus
  };
};
