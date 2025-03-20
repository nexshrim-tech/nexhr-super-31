
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Filter, Plus, Trash2, Eye, Edit, MessageSquare, Paperclip, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const tasks = [
  {
    id: 1,
    title: "Schedule Performance Reviews",
    dueDate: "2023-08-15",
    status: "In Progress",
    priority: "High",
    assignedTo: { name: "Olivia Rhye", avatar: "OR" },
    comments: [
      { id: 1, author: "Demi Wilkinson", avatar: "DW", text: "I've started scheduling these. Will complete by tomorrow.", date: "2023-08-10" }
    ],
    resources: [
      { id: 1, name: "Review_Template.docx", type: "document", uploadedBy: "Olivia Rhye", date: "2023-08-08" }
    ]
  },
  {
    id: 2,
    title: "Update Employee Handbook",
    dueDate: "2023-08-20",
    status: "To Do",
    priority: "Medium",
    assignedTo: { name: "Phoenix Baker", avatar: "PB" },
    comments: [],
    resources: []
  },
  {
    id: 3,
    title: "Conduct Team Building Activity",
    dueDate: "2023-08-25",
    status: "To Do",
    priority: "Medium",
    assignedTo: { name: "Lana Steiner", avatar: "LS" },
    comments: [],
    resources: []
  },
  {
    id: 4,
    title: "Review Leave Applications",
    dueDate: "2023-08-10",
    status: "Completed",
    priority: "High",
    assignedTo: { name: "Demi Wilkinson", avatar: "DW" },
    comments: [
      { id: 1, author: "Demi Wilkinson", avatar: "DW", text: "All applications have been reviewed and approved.", date: "2023-08-10" }
    ],
    resources: [
      { id: 1, name: "Leave_Summary.pdf", type: "document", uploadedBy: "Demi Wilkinson", date: "2023-08-10" }
    ]
  },
  {
    id: 5,
    title: "Finalize Q3 Budget",
    dueDate: "2023-08-12",
    status: "In Progress",
    priority: "High",
    assignedTo: { name: "Candice Wu", avatar: "CW" },
    comments: [],
    resources: []
  },
];

const TasksReminders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    status: "To Do",
    priority: "Medium",
    assignedTo: "",
  });
  const [newComment, setNewComment] = useState("");
  const [newResource, setNewResource] = useState<File | null>(null);
  const [resourceDescription, setResourceDescription] = useState("");
  const { toast } = useToast();

  // Filter tasks based on selected filters and search
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Handle edit button click
  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
  };

  // Handle view button click
  const handleViewTask = (task: any) => {
    setCurrentTask(task);
    setIsViewDialogOpen(true);
  };

  // Handle comment button click
  const handleCommentTask = (task: any) => {
    setCurrentTask(task);
    setIsCommentDialogOpen(true);
  };

  // Handle resource button click
  const handleResourceTask = (task: any) => {
    setCurrentTask(task);
    setIsResourceDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    toast({
      title: "Task updated",
      description: `"${currentTask.title}" has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  // Handle add task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTo) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added.`,
    });
    
    setNewTask({
      title: "",
      dueDate: "",
      status: "To Do",
      priority: "Medium",
      assignedTo: "",
    });
    
    setIsAddDialogOpen(false);
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task.",
    });
    
    setNewComment("");
    setIsCommentDialogOpen(false);
  };

  // Handle resource file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource(e.target.files[0]);
    }
  };

  // Handle add resource
  const handleAddResource = () => {
    if (!newResource) {
      toast({
        title: "Missing information",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Resource added",
      description: `"${newResource.name}" has been attached to the task.`,
    });
    
    setNewResource(null);
    setResourceDescription("");
    setIsResourceDialogOpen(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Tasks & Reminders</h1>
              <p className="text-gray-500">Manage tasks and set reminders</p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Schedule Performance Reviews</div>
                          <div className="text-sm text-muted-foreground">Due in 2 days</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        High
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Team Meeting</div>
                          <div className="text-sm text-muted-foreground">Today, 2:00 PM</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                        Medium
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Calendar className="h-5 w-5 text-nexhr-primary" />
                        <div>
                          <div className="font-medium">Review Leave Applications</div>
                          <div className="text-sm text-muted-foreground">Due in 1 week</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        Low
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Task Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">Total Tasks</div>
                      <div className="text-2xl font-medium">15</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">Completed</div>
                      <div className="text-2xl font-medium">7</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">In Progress</div>
                      <div className="text-2xl font-medium">5</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-gray-500">To Do</div>
                      <div className="text-2xl font-medium">3</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-base">All Tasks</CardTitle>
                      <Tabs 
                        defaultValue="all" 
                        onValueChange={(value) => setFilterStatus(value)}
                      >
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="To Do">To Do</TabsTrigger>
                          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                          <TabsTrigger value="Completed">Completed</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select 
                              value={filterPriority} 
                              onValueChange={setFilterPriority}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Search</Label>
                            <Input 
                              placeholder="Search tasks..." 
                              value={searchTerm} 
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-medium">{task.title}</TableCell>
                              <TableCell>{task.dueDate}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    task.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : task.status === "In Progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {task.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    task.priority === "High"
                                      ? "bg-red-100 text-red-800"
                                      : task.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {task.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="" alt={task.assignedTo.name} />
                                    <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{task.assignedTo.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewTask(task)}
                                    title="View details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleCommentTask(task)}
                                    title="Add comment"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleResourceTask(task)}
                                    title="Attach resource"
                                  >
                                    <Paperclip className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditTask(task)}
                                    title="Edit task"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-500"
                                    title="Delete task"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                              No tasks found. Try adjusting your filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* View Task Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {currentTask && (
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
                      <AvatarImage src="" alt={currentTask.assignedTo.name} />
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to the task details below.
            </DialogDescription>
          </DialogHeader>
          {currentTask && (
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
      <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>
              <Send className="h-4 w-4 mr-2" />
              Submit Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksReminders;

