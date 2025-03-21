
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { customerId, employeeId } = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracklist')
        .select(`
          *,
          assignee:employee!assignedto(firstname, lastname, profilepicturepath)
        `)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error fetching tasks',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchMyTasks = async () => {
    if (!employeeId) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracklist')
        .select(`
          *,
          assignee:employee!assignedto(firstname, lastname, profilepicturepath)
        `)
        .eq('assignedto', employeeId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching my tasks:', error);
      toast({
        title: 'Error fetching tasks',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return [];
    }
  };

  const fetchTask = async (taskId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracklist')
        .select(`
          *,
          assignee:employee!assignedto(firstname, lastname, profilepicturepath)
        `)
        .eq('tracklistid', taskId)
        .eq('customerid', customerId)
        .single();

      if (error) {
        throw error;
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      toast({
        title: 'Error fetching task',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const addTask = async (taskData: any) => {
    setLoading(true);
    try {
      // Add customerid and creator employeeid to the task data
      const newTaskData = {
        ...taskData,
        customerid: customerId,
        employeeid: employeeId
      };

      const { data, error } = await supabase
        .from('tracklist')
        .insert(newTaskData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Task added',
        description: 'Task has been successfully added',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error adding task',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const updateTask = async (taskId: number, taskData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracklist')
        .update(taskData)
        .eq('tracklistid', taskId)
        .eq('customerid', customerId)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Task updated',
        description: 'Task has been successfully updated',
      });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error updating task',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const deleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tracklist')
        .delete()
        .eq('tracklistid', taskId)
        .eq('customerid', customerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Task deleted',
        description: 'Task has been successfully deleted',
      });
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error deleting task',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    fetchTasks,
    fetchMyTasks,
    fetchTask,
    addTask,
    updateTask,
    deleteTask
  };
};
