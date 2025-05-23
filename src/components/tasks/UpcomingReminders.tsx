
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Task {
  tasklistid: string;
  tasktitle: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
  assignedto: string;
  comments: string;
  resources: string;
  employeeid: string;
  customerid: string;
}

interface UpcomingRemindersProps {
  tasks: Task[];
}

const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({ tasks }) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        // Fetch tasks with upcoming deadlines
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const { data, error } = await supabase
          .from('tasklist')
          .select('*')
          .gte('deadline', today.toISOString())
          .lte('deadline', nextWeek.toISOString())
          .neq('status', 'Completed')
          .order('deadline', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error fetching reminders:', error);
        } else {
          setReminders(data || []);
        }
      } catch (error) {
        console.error('Error in fetchReminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.ceil(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="border-t-4 border-t-orange-400 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-orange-400 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          <Clock className="h-5 w-5 text-orange-500" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {reminders.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No upcoming reminders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.tasklistid}
                className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {reminder.tasktitle || 'Untitled Task'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {reminder.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      className={`text-xs px-2 py-1 ${getPriorityColor(reminder.priority)}`}
                    >
                      {reminder.priority || 'Medium'}
                    </Badge>
                    <span className="text-xs font-medium text-orange-600">
                      {getTimeUntilDeadline(reminder.deadline)}
                    </span>
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
