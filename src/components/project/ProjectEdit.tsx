
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Sample employee data
const sampleEmployees = [
  { id: 1, name: "Olivia Rhye", avatar: "OR", role: "Designer" },
  { id: 2, name: "Phoenix Baker", avatar: "PB", role: "Developer" },
  { id: 3, name: "Lana Steiner", avatar: "LS", role: "Manager" },
  { id: 4, name: "Demi Wilkinson", avatar: "DW", role: "QA Engineer" },
  { id: 5, name: "Candice Wu", avatar: "CW", role: "Product Owner" },
];

interface ProjectEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onSave: (project: any) => void;
}

const ProjectEdit: React.FC<ProjectEditProps> = ({ open, onOpenChange, project, onSave }) => {
  const [editedProject, setEditedProject] = useState({
    ...project,
    assignees: [...project.assignees]
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!editedProject.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for the project",
        variant: "destructive"
      });
      return;
    }

    onSave(editedProject);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={editedProject.name}
              onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              value={editedProject.description}
              onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="project-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={editedProject.status}
                onValueChange={(value) => setEditedProject({...editedProject, status: value})}
              >
                <SelectTrigger id="project-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="project-priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={editedProject.priority}
                onValueChange={(value) => setEditedProject({...editedProject, priority: value})}
              >
                <SelectTrigger id="project-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="project-due-date" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="project-due-date"
              type="date"
              value={editedProject.dueDate}
              onChange={(e) => setEditedProject({...editedProject, dueDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Team Members
            </label>
            <ScrollArea className="h-[150px] border rounded-md p-2">
              <div className="space-y-2">
                {sampleEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`employee-${employee.id}`}
                      className="rounded border-gray-300"
                      checked={editedProject.assignees.includes(employee.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditedProject({
                            ...editedProject,
                            assignees: [...editedProject.assignees, employee.id]
                          });
                        } else {
                          setEditedProject({
                            ...editedProject,
                            assignees: editedProject.assignees.filter(id => id !== employee.id)
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`employee-${employee.id}`}
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                      <span className="text-xs text-gray-500">({employee.role})</span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!editedProject.name}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEdit;
