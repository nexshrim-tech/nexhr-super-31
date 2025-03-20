
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";

interface TaskType {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
  comments: any[];
  resources: any[];
}

interface TaskListProps {
  tasks: TaskType[];
  filteredTasks: TaskType[];
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleViewTask: (task: TaskType) => void;
  handleEditTask: (task: TaskType) => void;
  handleCommentTask: (task: TaskType) => void;
  handleResourceTask: (task: TaskType) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  filteredTasks,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  searchTerm,
  setSearchTerm,
  handleViewTask,
  handleEditTask,
  handleCommentTask,
  handleResourceTask,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">All Tasks</CardTitle>
          <TaskFilters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </CardHeader>
      <CardContent>
        <TaskTable
          tasks={filteredTasks}
          handleViewTask={handleViewTask}
          handleEditTask={handleEditTask}
          handleCommentTask={handleCommentTask}
          handleResourceTask={handleResourceTask}
        />
      </CardContent>
    </Card>
  );
};

export default TaskList;
