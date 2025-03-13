import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Sample ticket data
const tickets = [
  {
    id: "HD-1001",
    title: "Computer not starting",
    status: "Open",
    priority: "High",
    department: "IT Support",
    requestedBy: "John Doe",
    requestedAt: "2 hours ago",
    avatar: "JD",
    description: "My computer won't start after the recent software update. I've tried restarting multiple times but it gets stuck on the loading screen.",
    assignedTo: "Alex Martin",
    comments: [
      {
        id: 1,
        user: "Alex Martin",
        avatar: "AM",
        message: "Have you tried unplugging all peripherals and starting again?",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        user: "John Doe",
        avatar: "JD",
        message: "Yes, I tried that but it didn't work. Still stuck on the loading screen.",
        timestamp: "45 minutes ago"
      }
    ]
  },
  {
    id: "HD-1002",
    title: "Access to HR portal",
    status: "In Progress",
    priority: "Medium",
    department: "IT Support",
    requestedBy: "Jane Smith",
    requestedAt: "1 day ago",
    avatar: "JS",
    description: "I need access to the HR portal to update my personal information and tax details. My current credentials don't allow me to access it.",
    assignedTo: "Mark Wilson",
    comments: [
      {
        id: 1,
        user: "Mark Wilson",
        avatar: "MW",
        message: "I've submitted an access request to the HR team. Waiting for their approval.",
        timestamp: "6 hours ago"
      }
    ]
  },
  {
    id: "HD-1003",
    title: "Email not syncing on mobile",
    status: "Pending",
    priority: "Low",
    department: "IT Support",
    requestedBy: "Mike Johnson",
    requestedAt: "2 days ago",
    avatar: "MJ",
    description: "My email is not syncing on my mobile device. I've checked the settings but can't figure out what's wrong.",
    assignedTo: "Sarah Lee",
    comments: []
  },
  {
    id: "HD-1004",
    title: "Payroll discrepancy",
    status: "Resolved",
    priority: "Medium",
    department: "Finance",
    requestedBy: "Sarah Williams",
    requestedAt: "3 days ago",
    avatar: "SW",
    description: "There's a discrepancy in my latest payroll. The amount is less than what I expected.",
    assignedTo: "David Brown",
    comments: [
      {
        id: 1,
        user: "David Brown",
        avatar: "DB",
        message: "I've checked your payroll and found a deduction error. It has been corrected and will reflect in your next pay.",
        timestamp: "1 day ago"
      }
    ]
  },
  {
    id: "HD-1005",
    title: "New monitor request",
    status: "Open",
    priority: "Low",
    department: "IT Support",
    requestedBy: "Robert Brown",
    requestedAt: "4 days ago",
    avatar: "RB",
    description: "I need a new monitor for my workstation. The current one is too small for my work requirements.",
    assignedTo: null,
    comments: []
  },
];

// Define the form schema
const newTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  department: z.string().min(1, "Please select a department"),
  priority: z.string().min(1, "Please select a priority"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type NewTicketFormValues = z.infer<typeof newTicketSchema>;

const HelpDesk = () => {
  const [replyTicket, setReplyTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [viewTicketOpen, setViewTicketOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [ticketComment, setTicketComment] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // New ticket form
  const newTicketForm = useForm<NewTicketFormValues>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: {
      title: "",
      department: "",
      priority: "",
      description: "",
    },
  });

  const handleQuickReply = (ticket: any) => {
    setReplyTicket(ticket);
    setQuickChatOpen(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    
    toast({
      title: "Reply sent",
      description: `Your reply to ticket ${replyTicket.id} has been sent`
    });
    
    setReplyMessage("");
    setQuickChatOpen(false);
  };

  const handleNavigateToChatWithEmployee = (ticket: any) => {
    // In a real app, you would navigate to the chat with this employee
    // For now, we'll just navigate to the messenger page
    navigate('/messenger');
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${ticket.requestedBy}`
    });
  };

  const openNewTicketDialog = () => {
    newTicketForm.reset();
    setNewTicketOpen(true);
  };

  const viewTicket = (ticket: any) => {
    setCurrentTicket(ticket);
    setViewTicketOpen(true);
  };

  const handleNewTicketSubmit = (values: NewTicketFormValues) => {
    // In a real app, you would submit this to your backend
    // For now, we'll just show a toast
    console.log("New ticket values:", values);
    
    toast({
      title: "Ticket created",
      description: `Ticket "${values.title}" has been created successfully`
    });
    
    setNewTicketOpen(false);
    
    // Reset form
    newTicketForm.reset();
  };

  const handleSendComment = () => {
    if (!ticketComment.trim()) return;
    
    // In a real app, you would add this comment to the ticket in your backend
    toast({
      title: "Comment added",
      description: `Your comment has been added to ticket ${currentTicket.id}`
    });
    
    setTicketComment("");
  };

  const renderTicketItem = (ticket: any) => (
    <Card key={ticket.id}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{ticket.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{ticket.title}</h3>
                <Badge
                  variant={
                    ticket.status === "Open"
                      ? "destructive"
                      : ticket.status === "In Progress"
                      ? "default"
                      : ticket.status === "Pending"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    ticket.status === "Resolved"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {ticket.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    ticket.priority === "High"
                      ? "border-red-300 text-red-800"
                      : ticket.priority === "Medium"
                      ? "border-yellow-300 text-yellow-800"
                      : "border-green-300 text-green-800"
                  }
                >
                  {ticket.priority}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {ticket.id} • {ticket.department} • Requested by {ticket.requestedBy} {ticket.requestedAt}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isMobile ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm">Quick Reply</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Send a quick message to {ticket.requestedBy}
                      </p>
                    </div>
                    <Textarea 
                      placeholder="Type your reply..." 
                      className="min-h-[100px]" 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigateToChatWithEmployee(ticket)}
                      >
                        Open Full Chat
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleQuickReply(ticket)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => viewTicket(ticket)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Help Desk</h1>
              <p className="text-gray-500">Manage support tickets and requests</p>
            </div>
            <Link to="/">
              <Button>Back</Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search tickets..."
                  className="pl-10"
                />
              </div>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={openNewTicketDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <TabsList className="flex-wrap">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Open</TabsTrigger>
                <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">In Progress</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Pending</TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Resolved</TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {tickets.map(renderTicketItem)}
              </div>
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Open")
                  .map(renderTicketItem)}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "In Progress")
                  .map(renderTicketItem)}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Pending")
                  .map(renderTicketItem)}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              <div className="grid gap-4">
                {tickets
                  .filter((t) => t.status === "Resolved")
                  .map(renderTicketItem)}
              </div>
            </TabsContent>
          </Tabs>

          {/* Reply dialog for desktop */}
          <Dialog open={quickChatOpen} onOpenChange={setQuickChatOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Reply to {replyTicket?.requestedBy}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Ticket: {replyTicket?.title} ({replyTicket?.id})
                  </p>
                  <Textarea 
                    placeholder="Type your reply..." 
                    className="min-h-[150px]" 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (replyTicket) {
                      handleNavigateToChatWithEmployee(replyTicket);
                      setQuickChatOpen(false);
                    }
                  }}
                >
                  Open Full Chat
                </Button>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* New Ticket Dialog */}
          <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Support Ticket</DialogTitle>
              </DialogHeader>
              <Form {...newTicketForm}>
                <form onSubmit={newTicketForm.handleSubmit(handleNewTicketSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={newTicketForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a descriptive title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={newTicketForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IT Support">IT Support</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={newTicketForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={newTicketForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your issue in detail..." 
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Ticket
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* View Ticket Dialog */}
          <Dialog open={viewTicketOpen} onOpenChange={setViewTicketOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{currentTicket?.title}</DialogTitle>
                  <Badge
                    variant={
                      currentTicket?.status === "Open"
                        ? "destructive"
                        : currentTicket?.status === "In Progress"
                        ? "default"
                        : currentTicket?.status === "Pending"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      currentTicket?.status === "Resolved"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {currentTicket?.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <ScrollArea className="pr-4 max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Ticket ID: {currentTicket?.id}
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">REQUESTED BY</h4>
                        <p className="text-sm">{currentTicket?.requestedBy}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">DEPARTMENT</h4>
                        <p className="text-sm">{currentTicket?.department}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">PRIORITY</h4>
                        <p className="text-sm">{currentTicket?.priority}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">ASSIGNED TO</h4>
                        <p className="text-sm">{currentTicket?.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      {currentTicket?.description}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Comments</h3>
                    <div className="space-y-4">
                      {currentTicket?.comments && currentTicket.comments.length > 0 ? (
                        currentTicket.comments.map((comment: any) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{comment.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm">{comment.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No comments yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 text-sm">Add Comment</h3>
                <div className="flex gap-3">
                  <Textarea 
                    placeholder="Type your comment..." 
                    className="min-h-[80px]"
                    value={ticketComment}
                    onChange={(e) => setTicketComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <Button 
                    onClick={handleSendComment}
                    disabled={!ticketComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Comment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Open</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Open').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'In Progress').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Pending').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resolved</p>
                        <p className="font-semibold">{tickets.filter(t => t.status === 'Resolved').length}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
                <CardDescription>Average time to first response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="text-3xl font-bold">2.5 hrs</div>
                    <p className="text-sm text-gray-500">Average time</p>
                  </div>
                </div>
                <div className="pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>IT Support</span>
                    <span className="font-medium">1.8 hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>HR Department</span>
                    <span className="font-medium">3.2 hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Finance</span>
                    <span className="font-medium">4.0 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequent Issues</CardTitle>
                <CardDescription>Most common support topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Computer Issues</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Software Access</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Issues</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HR Inquiries</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;
