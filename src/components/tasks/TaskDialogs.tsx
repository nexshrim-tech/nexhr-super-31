
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface TaskDialogsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (task: Task | Omit<Task, 'tasklistid'>) => void;
}

const TaskDialogs: React.FC<TaskDialogsProps> = ({
  isOpen,
  onOpenChange,
  task,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    tasktitle: '',
    description: '',
    deadline: '',
    priority: 'Medium',
    status: 'Pending',
    assignedto: '',
    comments: '',
    resources: '',
    employeeid: '',
    customerid: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        tasktitle: task.tasktitle || '',
        description: task.description || '',
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        assignedto: task.assignedto || '',
        comments: task.comments || '',
        resources: task.resources || '',
        employeeid: task.employeeid || '',
        customerid: task.customerid || '',
      });
    } else {
      setFormData({
        tasktitle: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        status: 'Pending',
        assignedto: '',
        comments: '',
        resources: '',
        employeeid: '',
        customerid: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : '',
    };

    if (task) {
      onSave({ ...taskData, tasklistid: task.tasklistid });
    } else {
      onSave(taskData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tasktitle">Task Title</Label>
              <Input
                id="tasktitle"
                value={formData.tasktitle}
                onChange={(e) => setFormData({ ...formData, tasktitle: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="assignedto">Assigned To</Label>
              <Input
                id="assignedto"
                value={formData.assignedto}
                onChange={(e) => setFormData({ ...formData, assignedto: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="resources">Resources</Label>
            <Input
              id="resources"
              value={formData.resources}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              placeholder="Links, files, or other resources needed"
            />
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialogs;
