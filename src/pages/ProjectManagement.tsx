
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  MoreVertical, 
  Plus, 
  Search, 
  Users, 
  Calendar,
  MessageSquare,
  Trash2,
  Edit3,
  AlertTriangle,
  ChevronRight,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectEdit from "@/components/project/ProjectEdit";
import ResourceManagement from "@/components/project/ResourceManagement";

// Sample data for projects
const sampleEmployees = [
  { id: 1, name: "Olivia Rhye", avatar: "OR", role: "Designer" },
  { id: 2, name: "Phoenix Baker", avatar: "PB", role: "Developer" },
  { id: 3, name: "Lana Steiner", avatar: "LS", role: "Manager" },
  { id: 4, name: "Demi Wilkinson", avatar: "DW", role: "QA Engineer" },
  { id: 5, name: "Candice Wu", avatar: "CW", role: "Product Owner" },
];

const sampleProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website to improve user experience",
    status: "in-progress",
    priority: "high",
    progress: 65,
    dueDate: "2025-04-30",
    assignees: [1, 2, 3],
    tasks: [
      { id: 1, name: "Create wireframes", status: "completed" },
      { id: 2, name: "Design homepage", status: "completed" },
      { id: 3, name: "Implement responsive layout", status: "in-progress" },
      { id: 4, name: "Test on mobile devices", status: "planned" },
    ],
    comments: [
      { id: 1, user: sampleEmployees[0], text: "I've completed the wireframes", date: "2025-03-10" },
      { id: 2, user: sampleEmployees[2], text: "Looks great! Moving to the next phase.", date: "2025-03-12" },
    ]
  },
  {
    id: 2,
    name: "HR System Integration",
    description: "Integrate the new HR system with existing company software",
    status: "planned",
    priority: "medium",
    progress: 15,
    dueDate: "2025-05-15",
    assignees: [1, 4],
    tasks: [
      { id: 1, name: "Analyze requirements", status: "completed" },
      { id: 2, name: "Create API documentation", status: "in-progress" },
      { id: 3, name: "Develop integration layer", status: "planned" },
      { id: 4, name: "Test integration points", status: "planned" },
    ],
    comments: [
      { id: 1, user: sampleEmployees[3], text: "I've identified potential integration points", date: "2025-03-05" },
    ]
  },
  {
    id: 3,
    name: "Employee Training Program",
    description: "Develop training materials for new employee onboarding",
    status: "completed",
    priority: "low",
    progress: 100,
    dueDate: "2025-03-10",
    assignees: [2, 4, 5],
    tasks: [
      { id: 1, name: "Create training outline", status: "completed" },
      { id: 2, name: "Develop presentation slides", status: "completed" },
      { id: 3, name: "Record training videos", status: "completed" },
      { id: 4, name: "Publish materials to intranet", status: "completed" },
    ],
    comments: [
      { id: 1, user: sampleEmployees[4], text: "All materials have been reviewed and approved", date: "2025-03-09" },
      { id: 2, user: sampleEmployees[1], text: "Materials are now available on the intranet", date: "2025-03-10" },
    ]
  }
];

const ProjectManagement = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Form states for new project
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planned",
    priority: "medium",
    dueDate: "",
    assignees: [] as number[]
  });

  // Form states for new task
  const [newTask, setNewTask] = useState({
    name: "",
    status: "planned"
  });

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast({
        title: "Project name required",
        description: "Please enter a name for the project",
        variant: "destructive"
      });
      return;
    }

    const project = {
      id: projects.length + 1,
      ...newProject,
      progress: 0,
      tasks: [],
      comments: []
    };

    setProjects([...projects, project]);
    setIsCreateProjectOpen(false);
    setNewProject({
      name: "",
      description: "",
      status: "planned",
      priority: "medium",
      dueDate: "",
      assignees: []
    });

    toast({
      title: "Project created",
      description: `${project.name} has been created successfully`
    });
  };

  const handleAddTask = () => {
    if (!newTask.name || !selectedProject) return;

    const task = {
      id: (selectedProject.tasks?.length || 0) + 1,
      name: newTask.name,
      status: newTask.status
    };

    const updatedProject = {
      ...selectedProject,
      tasks: [...(selectedProject.tasks || []), task]
    };

    // Calculate new progress
    const totalTasks = updatedProject.tasks.length;
    const completedTasks = updatedProject.tasks.filter(t => t.status === "completed").length;
    updatedProject.progress = Math.round((completedTasks / totalTasks) * 100);

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setIsAddTaskOpen(false);
    setNewTask({ name: "", status: "planned" });

    toast({
      title: "Task added",
      description: `Task has been added to ${selectedProject.name}`
    });
  };

  const handleAddComment = () => {
    if (!newComment || !selectedProject) return;

    const comment = {
      id: (selectedProject.comments?.length || 0) + 1,
      user: sampleEmployees[2], // Assuming current user
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedProject = {
      ...selectedProject,
      comments: [...(selectedProject.comments || []), comment]
    };

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setNewComment("");

    toast({
      title: "Comment added",
      description: "Your comment has been added to the project"
    });
  };

  const handleUpdateTaskStatus = (taskId: number, status: string) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );

    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(t => t.status === "completed").length;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks,
      progress
    };

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);

    toast({
      title: "Task updated",
      description: "Task status has been updated"
    });
  };

  const handleEditProject = () => {
    if (selectedProject) {
      setIsEditProjectOpen(true);
    }
  };

  const handleSaveProjectEdits = (editedProject: any) => {
    const updatedProjects = projects.map(project => 
      project.id === editedProject.id ? editedProject : project
    );
    
    setProjects(updatedProjects);
    setSelectedProject(editedProject);
    
    toast({
      title: "Project updated",
      description: "The project details have been updated successfully"
    });
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planned": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "text-red-500";
      case "medium": return "text-orange-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-semibold">Project Management</h1>
            <p className="text-gray-500">Create and manage projects, assign tasks, and track progress</p>
          </div>
          
          {selectedProject ? (
            <div className="flex-1 p-4 lg:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedProject(null)}
                  >
                    <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
                    Back to Projects
                  </Button>
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedProject.status)}`} />
                  <span className="capitalize text-gray-600 text-sm">{selectedProject.status.replace("-", " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleEditProject}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Project
                  </Button>
                  <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                          Add a new task to {selectedProject.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="task-name" className="text-sm font-medium">
                            Task Name
                          </label>
                          <Input
                            id="task-name"
                            placeholder="Enter task name"
                            value={newTask.name}
                            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="task-status" className="text-sm font-medium">
                            Status
                          </label>
                          <Select
                            value={newTask.status}
                            onValueChange={(value) => setNewTask({...newTask, status: value})}
                          >
                            <SelectTrigger id="task-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask} disabled={!newTask.name}>
                          Add Task
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                              <CardDescription className="mt-2">
                                {selectedProject.description}
                              </CardDescription>
                            </div>
                            <Badge 
                              className={`${getPriorityColor(selectedProject.priority)} bg-transparent border`}
                            >
                              {selectedProject.priority} priority
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-medium mb-2">Progress</h3>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${selectedProject.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{selectedProject.progress}% complete</span>
                                <span className="text-xs text-gray-500">Due: {selectedProject.dueDate}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium mb-2">Tasks</h3>
                              <div className="space-y-2">
                                {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                                  selectedProject.tasks.map((task) => (
                                    <div 
                                      key={task.id} 
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                    >
                                      <div className="flex items-center gap-2">
                                        {task.status === "completed" ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : task.status === "in-progress" ? (
                                          <Clock className="h-5 w-5 text-blue-500" />
                                        ) : (
                                          <Clock className="h-5 w-5 text-yellow-500" />
                                        )}
                                        <span className={task.status === "completed" ? "line-through text-gray-500" : ""}>
                                          {task.name}
                                        </span>
                                      </div>
                                      <Select
                                        value={task.status}
                                        onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}
                                      >
                                        <SelectTrigger className="h-8 w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="planned">Planned</SelectItem>
                                          <SelectItem value="in-progress">In Progress</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8 border border-dashed rounded-md">
                                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">No tasks yet</p>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-2"
                                      onClick={() => setIsAddTaskOpen(true)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add Task
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Status</h3>
                              <p className="capitalize">{selectedProject.status.replace("-", " ")}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                              <p className="capitalize">{selectedProject.priority}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                              <p>{selectedProject.dueDate}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
                              <p>{selectedProject.assignees.length} members</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
                              <p>{selectedProject.tasks.length} tasks</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
                              <p>
                                {selectedProject.tasks.filter(t => t.status === "completed").length} of {selectedProject.tasks.length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-0">
                  <ResourceManagement projectId={selectedProject.id} />
                </TabsContent>
                
                <TabsContent value="team" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedProject.assignees.map((assigneeId: number) => {
                          const employee = sampleEmployees.find(e => e.id === assigneeId);
                          return employee ? (
                            <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{employee.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  <p className="text-sm text-gray-500">{employee.role}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                        
                        <Button className="w-full" variant="outline" onClick={handleEditProject}>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Team Members
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comments" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedProject.comments && selectedProject.comments.length > 0 ? (
                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                              {selectedProject.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar>
                                    <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium">{comment.user.name}</div>
                                      <div className="text-xs text-gray-500">{comment.date}</div>
                                    </div>
                                    <p className="text-sm mt-1">{comment.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="text-center py-6">
                            <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">No comments yet</p>
                          </div>
                        )}
                        
                        <div className="mt-4 space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-[80px]"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleAddComment} disabled={!newComment}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new project
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
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="project-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            id="project-description"
                            placeholder="Enter project description"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="project-status" className="text-sm font-medium">
                              Status
                            </label>
                            <Select
                              value={newProject.status}
                              onValueChange={(value) => setNewProject({...newProject, status: value})}
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
                              value={newProject.priority}
                              onValueChange={(value) => setNewProject({...newProject, priority: value})}
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
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
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
                                    id={`employee-${employee.id}`}
                                    className="rounded border-gray-300"
                                    checked={newProject.assignees.includes(employee.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setNewProject({
                                          ...newProject,
                                          assignees: [...newProject.assignees, employee.id]
                                        });
                                      } else {
                                        setNewProject({
                                          ...newProject,
                                          assignees: newProject.assignees.filter(id => id !== employee.id)
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
                        <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateProject} disabled={!newProject.name}>
                          Create Project
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <Card 
                      key={project.id} 
                      className="hover:border-blue-200 cursor-pointer transition-all hover:shadow-md"
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)} mr-2`} />
                            <CardTitle className="text-base">{project.name}</CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">
                          {project.description}
                        </p>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500 mb-4">
                          <span>{project.progress}% complete</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.dueDate}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.assignees.slice(0, 3).map((assigneeId, index) => {
                              const employee = sampleEmployees.find(e => e.id === assigneeId);
                              return employee ? (
                                <Avatar key={employee.id} className="h-7 w-7 border-2 border-white">
                                  <AvatarFallback>{employee.avatar}</AvatarFallback>
                                </Avatar>
                              ) : null;
                            })}
                            {project.assignees.length > 3 && (
                              <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                +{project.assignees.length - 3}
                              </div>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getPriorityColor(project.priority)}`}
                          >
                            {project.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="lg:col-span-3 text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No projects found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Create a new project or adjust your filters
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setIsCreateProjectOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Edit Dialog */}
      <ProjectEdit 
        open={isEditProjectOpen}
        onOpenChange={setIsEditProjectOpen}
        project={selectedProject || {}}
        onSave={handleSaveProjectEdits}
      />
    </div>
  );
};

export default ProjectManagement;
