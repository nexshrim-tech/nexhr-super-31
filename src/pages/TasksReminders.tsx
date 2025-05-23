
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/ui/layout";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import TaskSummary from "@/components/tasks/TaskSummary";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskTable from "@/components/tasks/TaskTable";
import TaskDialogs from "@/components/tasks/TaskDialogs";
import UpcomingReminders from "@/components/tasks/UpcomingReminders";

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

const TasksReminders = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from('tasklist')
        .select('*')
        .order('deadline', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Tasks loaded:', data);
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "There was a problem loading the task list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch = task.tasktitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleCreateTask = async (taskData: Omit<Task, 'tasklistid'>) => {
    try {
      const { data, error } = await supabase
        .from('tasklist')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });

      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const { error } = await supabase
        .from('tasklist')
        .update(updatedTask)
        .eq('tasklistid', updatedTask.tasklistid);

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });

      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasklist')
        .delete()
        .eq('tasklistid', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });

      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in flex items-center">
            Tasks & Reminders
            <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse-slow" />
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-nexhr-primary to-purple-600 mt-1 mb-3 rounded-full"></div>
          <p className="text-gray-600">
            Manage tasks and set reminders for your team
          </p>
        </div>

        <TaskSummary stats={taskStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Card className="border-t-4 border-t-nexhr-primary shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                  Task Management
                </CardTitle>
                <TaskFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                  onCreateTask={() => {
                    setSelectedTask(null);
                    setIsTaskDialogOpen(true);
                  }}
                />
              </CardHeader>
              
              <CardContent className="p-0">
                <TaskTable 
                  tasks={filteredTasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <UpcomingReminders tasks={filteredTasks} />
          </div>
        </div>

        <TaskDialogs 
          isOpen={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          task={selectedTask}
          onSave={selectedTask ? handleUpdateTask : handleCreateTask}
        />
      </div>
    </Layout>
  );
};

export default TasksReminders;
