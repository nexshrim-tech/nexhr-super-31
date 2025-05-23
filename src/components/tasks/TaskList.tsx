
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskFilters from "./TaskFilters";
import TaskTable, { Task } from "./TaskTable";

interface TaskListProps {
  tasks: Task[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: () => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  isLoading = false,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">All Tasks</CardTitle>
          <TaskFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            onCreateTask={onCreateTask}
          />
        </div>
      </CardHeader>
      <CardContent>
        <TaskTable
          tasks={tasks}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default TaskList;
