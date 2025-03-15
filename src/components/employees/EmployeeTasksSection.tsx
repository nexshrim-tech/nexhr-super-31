
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";

interface Task {
  id: number;
  name: string;
  deadline: string;
  status: string;
  action: string;
}

interface EmployeeTasksSectionProps {
  tasks: Task[];
}

const EmployeeTasksSection: React.FC<EmployeeTasksSectionProps> = ({ tasks }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500 w-12"></th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  Name <ArrowLeft className="h-4 w-4 rotate-90" />
                </div>
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  Deadline <ArrowLeft className="h-4 w-4 rotate-90" />
                </div>
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  Status <ArrowLeft className="h-4 w-4 rotate-90" />
                </div>
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  Action <ArrowLeft className="h-4 w-4 rotate-90" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" checked={task.status === "Completed"} readOnly className="rounded" />
                </td>
                <td className="p-3 font-medium">{task.name}</td>
                <td className="p-3 text-gray-600">{task.deadline}</td>
                <td className="p-3">
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {task.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge className={getActionBadgeColor(task.action)}>
                    {task.action}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTasksSection;
