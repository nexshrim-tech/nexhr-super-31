
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
    id: 0,
    name: '',
    description: '',
    status: 'planned',
    priority: 'medium',
    dueDate: '',
    assignees: [] as number[],
    progress: 0,
    tasks: [] as any[],
    comments: [] as any[],
    projectId: ''
  });

  useEffect(() => {
    if (project && project.id) {
      // Make sure assignees is always an array
      const assignees = Array.isArray(project.assignees) ? project.assignees : [];
      
      setEditedProject({
        ...project,
        assignees,
        projectId: project.projectId || generateProjectId()
      });
    }
  }, [project]);

  const generateProjectId = () => {
    const prefix = "PRJ-";
    const number = String(project.id || 1).padStart(3, '0');
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${number}-${randomId}`;
  };

  const refreshProjectId = () => {
    setEditedProject(prev => ({
      ...prev,
      projectId: generateProjectId()
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProject({
      ...editedProject,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedProject({
      ...editedProject,
      [name]: value
    });
  };

  const handleAssigneeChange = (employeeId: number) => {
    setEditedProject(prev => {
      const currentAssignees = [...prev.assignees];
      
      if (currentAssignees.includes(employeeId)) {
        return {
          ...prev,
          assignees: currentAssignees.filter(id => id !== employeeId)
        };
      } else {
        return {
          ...prev,
          assignees: [...currentAssignees, employeeId]
        };
      }
    });
  };

  const handleSave = () => {
    onSave(editedProject);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-id-edit" className="text-sm font-medium">
              Project ID
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="project-id-edit"
                name="projectId"
                value={editedProject.projectId}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={refreshProjectId}
                className="h-10 w-10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="project-name"
              name="name"
              placeholder="Enter project name"
              value={editedProject.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="project-description"
              name="description"
              placeholder="Enter project description"
              value={editedProject.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="project-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={editedProject.status}
                onValueChange={(value) => handleSelectChange('status', value)}
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
                onValueChange={(value) => handleSelectChange('priority', value)}
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
              name="dueDate"
              type="date"
              value={editedProject.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assign Team Members
            </label>
            <ScrollArea className="h-[150px] border rounded-md p-2">
              <div className="space-y-2">
                {sampleEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`employee-edit-${employee.id}`}
                      className="rounded border-gray-300"
                      checked={editedProject.assignees.includes(employee.id)}
                      onChange={() => handleAssigneeChange(employee.id)}
                    />
                    <label 
                      htmlFor={`employee-edit-${employee.id}`}
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
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEdit;
