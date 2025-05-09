
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ListTodo } from "lucide-react";

interface Task {
  id: string | number;
  title?: string;
  dueDate?: string;
  due_date?: string;
  status: string;
  priority: string;
  assignedTo?: { name: string; avatar: string } | string;
  assigned_to?: string | { name: string; avatar: string };
  comments?: any[];
  resources?: any[];
}

interface SummaryItemProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface TaskSummaryProps {
  tasks?: Task[];
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, count, icon, color, bgColor }) => (
  <div className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${bgColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600 font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold">{count}</div>
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks = [] }) => {
  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "Completed").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const toDo = tasks.filter(task => task.status === "To Do").length;
    
    return { total, completed, inProgress, toDo };
  }, [tasks]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-indigo-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          Task Summary
          <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-800 px-2">
            Overview
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem 
            title="Total Tasks" 
            count={taskCounts.total} 
            icon={<ListTodo className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            bgColor="bg-blue-50 border-blue-100"
          />
          <SummaryItem 
            title="Completed" 
            count={taskCounts.completed} 
            icon={<Check className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-green-600 to-green-700 text-white"
            bgColor="bg-green-50 border-green-100"
          />
          <SummaryItem 
            title="In Progress" 
            count={taskCounts.inProgress} 
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
            bgColor="bg-yellow-50 border-yellow-100"
          />
          <SummaryItem 
            title="To Do" 
            count={taskCounts.toDo} 
            icon={<ListTodo className="h-6 w-6 text-white" />}
            color="bg-gradient-to-r from-purple-600 to-purple-700 text-white"
            bgColor="bg-purple-50 border-purple-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummary;
