
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface Task {
  tasklistid: string;
  tasktitle: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
  assignedto: string;
}

const UpcomingReminders = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        setLoading(true);
        
        // Get tasks that are due in the next 7 days
        const sevenDaysFromNow = addDays(new Date(), 7);
        
        const { data, error } = await supabase
          .from('tasklist') // Changed from 'tracklist' to 'tasklist' to match schema
          .select('*')
          .neq('status', 'completed')
          .lte('deadline', sevenDaysFromNow.toISOString())
          .order('deadline', { ascending: true });

        if (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: "Error",
            description: "Failed to fetch upcoming tasks",
            variant: "destructive",
          });
          return;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingTasks();

    // Set up real-time subscription for task updates
    const subscription = supabase
      .channel('task-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasklist'
      }, () => {
        fetchUpcomingTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleMarkComplete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasklist')
        .update({ status: 'completed' })
        .eq('tasklistid', taskId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Task marked as completed",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (deadline: string) => {
    return isBefore(new Date(deadline), new Date());
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading upcoming tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No upcoming tasks or reminders.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.tasklistid}
                className={`p-3 border rounded-lg ${
                  isOverdue(task.deadline) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{task.tasktitle}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.deadline), 'MMM dd, yyyy')}
                      </div>
                      {isOverdue(task.deadline) && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                    {task.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkComplete(task.tasklistid)}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
