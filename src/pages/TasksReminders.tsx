
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Imported components
import UpcomingReminders from "@/components/tasks/UpcomingReminders";
import TaskSummary from "@/components/tasks/TaskSummary";
import TaskList from "@/components/tasks/TaskList";
import { 
  ViewTaskDialog, 
  EditTaskDialog, 
  AddTaskDialog, 
  CommentDialog, 
  ResourceDialog 
} from "@/components/tasks/TaskDialogs";

// Sample data
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
              <UpcomingReminders />
              <TaskSummary />
            </div>

            <div className="md:col-span-2">
              <TaskList
                tasks={tasks}
                filteredTasks={filteredTasks}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleViewTask={handleViewTask}
                handleEditTask={handleEditTask}
                handleCommentTask={handleCommentTask}
                handleResourceTask={handleResourceTask}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ViewTaskDialog 
        isOpen={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen} 
        currentTask={currentTask} 
      />
      
      <EditTaskDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        currentTask={currentTask} 
        onSave={handleSaveEdit}
      />
      
      <AddTaskDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        newTask={newTask}
        setNewTask={setNewTask}
        onSave={handleAddTask}
      />
      
      <CommentDialog 
        isOpen={isCommentDialogOpen} 
        onOpenChange={setIsCommentDialogOpen} 
        currentTask={currentTask}
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={handleAddComment}
      />
      
      <ResourceDialog 
        isOpen={isResourceDialogOpen} 
        onOpenChange={setIsResourceDialogOpen} 
        currentTask={currentTask}
        newResource={newResource}
        resourceDescription={resourceDescription}
        setResourceDescription={setResourceDescription}
        handleFileChange={handleFileChange}
        onAddResource={handleAddResource}
      />
    </div>
  );
};

export default TasksReminders;
