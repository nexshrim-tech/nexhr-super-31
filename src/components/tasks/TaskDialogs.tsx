
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Paperclip, Send } from "lucide-react";

// Types
interface DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: any;
  onSave?: () => void;
}

interface TaskEditDialogProps extends DialogProps {
  onSave: () => void;
}

interface TaskAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: {
    title: string;
    dueDate: string;
    status: string;
    priority: string;
    assignedTo: string;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    dueDate: string;
    status: string;
    priority: string;
    assignedTo: string;
  }>>;
  onSave: () => void;
}

interface CommentDialogProps extends DialogProps {
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  onAddComment: () => void;
}

interface ResourceDialogProps extends DialogProps {
  newResource: File | null;
  resourceDescription: string;
  setResourceDescription: React.Dispatch<React.SetStateAction<string>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddResource: () => void;
}

// View Task Dialog
export const ViewTaskDialog: React.FC<DialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  currentTask 
}) => {
  if (!currentTask) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{currentTask.title}</h3>
            <div className="flex gap-2 mt-2">
              <Badge
                className={`${
                  currentTask.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : currentTask.status === "In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {currentTask.status}
              </Badge>
              <Badge
                className={`${
                  currentTask.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : currentTask.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {currentTask.priority}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p>{currentTask.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned To</p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{currentTask.assignedTo.avatar}</AvatarFallback>
                </Avatar>
                <span>{currentTask.assignedTo.name}</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">No description provided.</p>
          </div>

          {/* Resources Section */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Resources</p>
            {currentTask.resources && currentTask.resources.length > 0 ? (
              <div className="space-y-2">
                {currentTask.resources.map((resource: any) => (
                  <div key={resource.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-blue-500" />
                      <span>{resource.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Uploaded by {resource.uploadedBy} on {resource.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No resources attached.</p>
            )}
          </div>

          {/* Comments Section */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Comments</p>
            {currentTask.comments && currentTask.comments.length > 0 ? (
              <div className="space-y-3">
                {currentTask.comments.map((comment: any) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{comment.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Edit Task Dialog
export const EditTaskDialog: React.FC<TaskEditDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  currentTask,
  onSave
}) => {
  if (!currentTask) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to the task details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="taskTitle">Title</Label>
            <Input
              id="taskTitle"
              defaultValue={currentTask.title}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taskDueDate">Due Date</Label>
            <Input
              id="taskDueDate"
              type="date"
              defaultValue={currentTask.dueDate}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="taskStatus">Status</Label>
              <Select defaultValue={currentTask.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taskPriority">Priority</Label>
              <Select defaultValue={currentTask.priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taskAssignee">Assigned To</Label>
            <Select defaultValue={currentTask.assignedTo.name}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Olivia Rhye">Olivia Rhye</SelectItem>
                <SelectItem value="Phoenix Baker">Phoenix Baker</SelectItem>
                <SelectItem value="Lana Steiner">Lana Steiner</SelectItem>
                <SelectItem value="Demi Wilkinson">Demi Wilkinson</SelectItem>
                <SelectItem value="Candice Wu">Candice Wu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="taskDescription">Description</Label>
            <Textarea
              id="taskDescription"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Task Dialog
export const AddTaskDialog: React.FC<TaskAddDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  newTask,
  setNewTask,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task by filling in the information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="newTaskTitle">Title</Label>
            <Input
              id="newTaskTitle"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newTaskDueDate">Due Date</Label>
            <Input
              id="newTaskDueDate"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newTaskStatus">Status</Label>
              <Select 
                value={newTask.status}
                onValueChange={(value) => setNewTask({...newTask, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newTaskPriority">Priority</Label>
              <Select 
                value={newTask.priority}
                onValueChange={(value) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newTaskAssignee">Assigned To</Label>
            <Select
              value={newTask.assignedTo}
              onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Olivia Rhye">Olivia Rhye</SelectItem>
                <SelectItem value="Phoenix Baker">Phoenix Baker</SelectItem>
                <SelectItem value="Lana Steiner">Lana Steiner</SelectItem>
                <SelectItem value="Demi Wilkinson">Demi Wilkinson</SelectItem>
                <SelectItem value="Candice Wu">Candice Wu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newTaskDescription">Description</Label>
            <Textarea
              id="newTaskDescription"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Comment Dialog
export const CommentDialog: React.FC<CommentDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  currentTask,
  newComment,
  setNewComment,
  onAddComment
}) => {
  if (!currentTask) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add a comment to the task "{currentTask?.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Enter your comment..."
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddComment}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Resource Dialog
export const ResourceDialog: React.FC<ResourceDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  currentTask,
  newResource,
  resourceDescription,
  setResourceDescription,
  handleFileChange,
  onAddResource
}) => {
  if (!currentTask) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Resource</DialogTitle>
          <DialogDescription>
            Attach a file or resource to the task "{currentTask?.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="resource">Select File</Label>
            <Input
              id="resource"
              type="file"
              onChange={handleFileChange}
            />
            {newResource && (
              <p className="text-sm text-green-600">Selected: {newResource.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resourceDescription">Description (optional)</Label>
            <Textarea
              id="resourceDescription"
              placeholder="Enter a description for this resource..."
              rows={2}
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddResource}>
            <Send className="h-4 w-4 mr-2" />
            Submit Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
