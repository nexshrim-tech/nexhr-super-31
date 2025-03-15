
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const EmployeeTasksSection: React.FC<EmployeeTasksSectionProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    deadline: "",
    status: "Pending",
    action: "Active"
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.deadline) return;
    
    const taskToAdd: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      name: newTask.name as string,
      deadline: newTask.deadline as string,
      status: newTask.status as string,
      action: newTask.action as string
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      name: "",
      deadline: "",
      status: "Pending",
      action: "Active"
    });
    setShowAddTaskDialog(false);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setShowAddTaskDialog(true)}>
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

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input 
                id="taskName" 
                name="name" 
                value={newTask.name} 
                onChange={handleInputChange} 
                placeholder="Enter task name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                value={newTask.deadline} 
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newTask.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select 
                value={newTask.action} 
                onValueChange={(value) => handleSelectChange("action", value)}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeTasksSection;
