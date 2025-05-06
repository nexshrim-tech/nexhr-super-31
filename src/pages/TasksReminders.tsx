import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const TasksReminders = () => {
  const [tasks, setTasks] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user and fetch tasks
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchTasks(data.user.id);
      } else {
        setLoading(false);
        toast({
          title: "Authentication required",
          description: "Please sign in to view your tasks",
          variant: "destructive",
        });
      }
    };

    getUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id);
          fetchTasks(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setTasks([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = async (uid: string) => {
    setLoading(true);
    try {
      // Try to fetch from our new tasks table first (with UUID user_id)
      const { data: newTasks, error: newTasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (newTasksError) {
        console.error('Error fetching tasks:', newTasksError);
      }

      // Fall back to sample data if no tasks in database
      if (newTasks && newTasks.length > 0) {
        setTasks(newTasks);
      } else {
        // Sample data as fallback
        setTasks([
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
        ]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Failed to load tasks",
        description: "There was an error loading your tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on selected filters and search
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    let matchesSearch = false;
    if (typeof task.title === 'string') {
      matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (typeof task.assignedTo === 'object' && task.assignedTo?.name) {
      matchesSearch = matchesSearch || task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (typeof task.assignedTo === 'string') {
      matchesSearch = matchesSearch || task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
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
  const handleSaveEdit = async () => {
    if (!currentTask || !userId) return;
    
    try {
      // Check if we're working with a Supabase task (has UUID id)
      if (typeof currentTask.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentTask.id)) {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: currentTask.title,
            due_date: currentTask.dueDate,
            status: currentTask.status,
            priority: currentTask.priority,
            assigned_to: typeof currentTask.assignedTo === 'object' ? 
              currentTask.assignedTo.name : currentTask.assignedTo,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTask.id);
          
        if (error) throw error;
        
        // Refresh tasks
        fetchTasks(userId);
      } else {
        // Handle local sample data
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === currentTask.id ? currentTask : task
          )
        );
      }
      
      toast({
        title: "Task updated",
        description: `"${currentTask.title}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the task.",
        variant: "destructive",
      });
    }
    
    setIsEditDialogOpen(false);
  };

  // Handle add task
  const handleAddTask = async () => {
    if (!userId) return;
    
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTo) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          title: newTask.title,
          due_date: newTask.dueDate,
          status: newTask.status,
          priority: newTask.priority,
          assigned_to: newTask.assignedTo
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTasks(prevTasks => [...data, ...prevTasks]);
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
      
      // Refresh tasks
      fetchTasks(userId);
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Failed to add task",
        description: "There was an error adding your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !userId || !currentTask) {
      toast({
        title: "Missing information",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // For Supabase tasks
      if (typeof currentTask.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentTask.id)) {
        const { error } = await supabase
          .from('task_comments')
          .insert({
            task_id: currentTask.id,
            user_id: userId,
            comment: newComment
          });
          
        if (error) throw error;
        
        // Refresh the task
        fetchTasks(userId);
      } else {
        // Handle local sample data
        const newCommentObj = {
          id: Date.now(),
          author: "Current User",
          avatar: "CU",
          text: newComment,
          date: new Date().toISOString().split('T')[0]
        };
        
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === currentTask.id) {
              return {
                ...task,
                comments: [...(task.comments || []), newCommentObj]
              };
            }
            return task;
          })
        );
      }
      
      toast({
        title: "Comment added",
        description: "Your comment has been added to the task.",
      });
      
      setNewComment("");
      setIsCommentDialogOpen(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: "There was an error adding your comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle resource file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource(e.target.files[0]);
    }
  };

  // Handle add resource
  const handleAddResource = async () => {
    if (!newResource || !userId || !currentTask) {
      toast({
        title: "Missing information",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // For Supabase tasks
      if (typeof currentTask.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentTask.id)) {
        // In a real implementation, we would upload the file to storage
        // For now, just record the resource metadata
        const { error } = await supabase
          .from('task_resources')
          .insert({
            task_id: currentTask.id,
            user_id: userId,
            name: newResource.name,
            url: URL.createObjectURL(newResource), // This is just a temporary URL
            type: newResource.type
          });
          
        if (error) throw error;
        
        // Refresh the task
        fetchTasks(userId);
      } else {
        // Handle local sample data
        const newResourceObj = {
          id: Date.now(),
          name: newResource.name,
          type: newResource.type,
          uploadedBy: "Current User",
          date: new Date().toISOString().split('T')[0]
        };
        
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === currentTask.id) {
              return {
                ...task,
                resources: [...(task.resources || []), newResourceObj]
              };
            }
            return task;
          })
        );
      }
      
      toast({
        title: "Resource added",
        description: `"${newResource.name}" has been attached to the task.`,
      });
      
      setNewResource(null);
      setResourceDescription("");
      setIsResourceDialogOpen(false);
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Failed to add resource",
        description: "There was an error attaching your resource. Please try again.",
        variant: "destructive",
      });
    }
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

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your tasks...</p>
            </div>
          ) : !userId ? (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">Please sign in to view your tasks</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <UpcomingReminders tasks={tasks} />
                <TaskSummary tasks={tasks} />
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
          )}
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
