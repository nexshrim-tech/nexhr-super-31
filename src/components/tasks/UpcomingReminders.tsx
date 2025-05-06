
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import TaskCard from "./TaskCard";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string | number;
  title: string;
  due_date?: string;
  dueDate?: string;
  status: string;
  priority: string;
  assigned_to?: string | { name: string; avatar: string };
  assignedTo?: { name: string; avatar: string } | string;
}

// Helper function to convert tracklist item to Task format
const convertTracklistToTask = (tracklistItem: any): Task => {
  return {
    id: tracklistItem.tracklistid || tracklistItem.id,
    title: tracklistItem.tasktitle || tracklistItem.title,
    due_date: tracklistItem.deadline,
    dueDate: tracklistItem.deadline || tracklistItem.dueDate,
    status: tracklistItem.status,
    priority: tracklistItem.priority,
    assigned_to: tracklistItem.assignedto,
    assignedTo: tracklistItem.assignedto || tracklistItem.assignedTo
  };
};

interface UpcomingRemindersProps {
  tasks?: Task[];
}

const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({ tasks = [] }) => {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Find upcoming tasks from provided tasks or fetch from database
    if (tasks && tasks.length > 0) {
      const upcoming = tasks
        .filter(task => {
          const dueDate = task.due_date || task.dueDate;
          if (!dueDate) return false;
          
          const today = new Date();
          const taskDate = new Date(dueDate);
          const diffTime = taskDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays >= 0 && diffDays <= 7; // Next 7 days
        })
        .sort((a, b) => {
          const dateA = new Date(a.due_date || a.dueDate || "");
          const dateB = new Date(b.due_date || b.dueDate || "");
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3); // Get top 3
        
      setUpcomingTasks(upcoming);
    } else {
      const fetchUpcomingTasks = async () => {
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            
            // Use tracklist table instead of tasks
            const { data: upcomingData, error } = await supabase
              .from('tracklist')
              .select('*')
              .gte('deadline', today.toISOString().split('T')[0])
              .lte('deadline', nextWeek.toISOString().split('T')[0])
              .eq('customerid', authData.user.id) // Using UUID directly
              .order('deadline', { ascending: true })
              .limit(3);
              
            if (error) {
              console.error("Error fetching upcoming tasks:", error);
              return;
            }
              
            if (upcomingData) {
              // Convert tracklist items to Task format
              const formattedTasks = upcomingData.map(convertTracklistToTask);
              setUpcomingTasks(formattedTasks);
            }
          }
        } catch (error) {
          console.error("Error fetching upcoming tasks:", error);
        }
      };
      
      fetchUpcomingTasks();
    }
  }, [tasks]);

  const getSubtitle = (task: Task) => {
    const dueDate = task.due_date || task.dueDate;
    if (!dueDate) return "";
    
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return "";
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Bell className="h-5 w-5 mr-2 text-orange-500" />
          Upcoming Reminders
          <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800 px-2">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              subtitle={getSubtitle(task)}
              badge={task.priority}
              badgeColor={
                task.priority === "High"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }
              dueText=""
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No upcoming tasks for the next week
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
