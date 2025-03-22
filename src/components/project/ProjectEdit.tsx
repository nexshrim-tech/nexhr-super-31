
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
import { fetchEmployees } from '@/integrations/supabase/functions';
import { useAuth } from '@/context/AuthContext';

interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  jobtitle?: string;
  avatar?: string;
}

interface ProjectEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onSave: (project: any) => void;
}

const ProjectEdit: React.FC<ProjectEditProps> = ({ open, onOpenChange, project, onSave }) => {
  const { customerData } = useAuth();
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadEmployees = async () => {
      if (!customerData?.customerid) return;
      
      try {
        setLoading(true);
        const data = await fetchEmployees(customerData.customerid);
        
        // Map employee data to include avatar
        const mappedEmployees = data.map((emp: any) => ({
          employeeid: emp.employeeid,
          firstname: emp.firstname,
          lastname: emp.lastname,
          jobtitle: emp.jobtitle,
          avatar: `${emp.firstname?.charAt(0) || ''}${emp.lastname?.charAt(0) || ''}`
        }));
        
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error loading employees:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      loadEmployees();
    }
  }, [open, customerData]);

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
    // Convert from front-end model to database model if needed
    const projectToSave = {
      ...editedProject,
      // Map any additional fields if needed
    };
    
    onSave(projectToSave);
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
            {loading ? (
              <div className="text-center py-4">Loading employees...</div>
            ) : (
              <ScrollArea className="h-[150px] border rounded-md p-2">
                <div className="space-y-2">
                  {employees.map((employee) => (
                    <div key={employee.employeeid} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`employee-edit-${employee.employeeid}`}
                        className="rounded border-gray-300"
                        checked={editedProject.assignees.includes(employee.employeeid)}
                        onChange={() => handleAssigneeChange(employee.employeeid)}
                      />
                      <label 
                        htmlFor={`employee-edit-${employee.employeeid}`}
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <span>{employee.firstname} {employee.lastname}</span>
                        <span className="text-xs text-gray-500">({employee.jobtitle || 'Employee'})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
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
