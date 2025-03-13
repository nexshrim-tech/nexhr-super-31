
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Eye, MoreHorizontal, Upload, MessageSquare, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample data for tickets
const ticketsData = [
  {
    id: "HD-1001",
    title: "Computer won't turn on",
    status: "Open",
    priority: "High",
    category: "Hardware",
    createdBy: {
      name: "Olivia Rhye",
      avatar: "OR"
    },
    assignedTo: {
      name: "Technical Support",
      avatar: "TS"
    },
    created: "2023-05-10T09:00:00",
    updated: "2023-05-10T09:00:00",
    description: "My computer suddenly stopped turning on. The power light doesn't come on at all.",
    comments: [
      {
        id: 1,
        user: {
          name: "Technical Support",
          avatar: "TS"
        },
        text: "Have you checked if the computer is plugged in and if the power outlet is working?",
        timestamp: "2023-05-10T10:30:00"
      },
      {
        id: 2,
        user: {
          name: "Olivia Rhye",
          avatar: "OR"
        },
        text: "Yes, I've checked both. The outlet is working fine as other devices work when plugged in there.",
        timestamp: "2023-05-10T11:15:00"
      }
    ]
  },
  {
    id: "HD-1002",
    title: "Need access to financial reports",
    status: "In Progress",
    priority: "Medium",
    category: "Access Request",
    createdBy: {
      name: "Phoenix Baker",
      avatar: "PB"
    },
    assignedTo: {
      name: "IT Security",
      avatar: "IS"
    },
    created: "2023-05-09T14:30:00",
    updated: "2023-05-09T16:45:00",
    description: "I need access to the financial reports directory for my quarterly reporting tasks.",
    comments: [
      {
        id: 1,
        user: {
          name: "IT Security",
          avatar: "IS"
        },
        text: "We've received your request and are processing it. We need manager approval for this access.",
        timestamp: "2023-05-09T15:00:00"
      }
    ]
  },
  {
    id: "HD-1003",
    title: "Email not syncing on mobile",
    status: "Resolved",
    priority: "Low",
    category: "Software",
    createdBy: {
      name: "Lana Steiner",
      avatar: "LS"
    },
    assignedTo: {
      name: "Email Support",
      avatar: "ES"
    },
    created: "2023-05-08T10:15:00",
    updated: "2023-05-08T13:20:00",
    description: "My work email is not syncing on my mobile device. It was working fine until yesterday.",
    comments: [
      {
        id: 1,
        user: {
          name: "Email Support",
          avatar: "ES"
        },
        text: "Could you try removing and re-adding your email account on the mobile device?",
        timestamp: "2023-05-08T10:45:00"
      },
      {
        id: 2,
        user: {
          name: "Lana Steiner",
          avatar: "LS"
        },
        text: "That worked! Thank you for the quick solution.",
        timestamp: "2023-05-08T11:30:00"
      },
      {
        id: 3,
        user: {
          name: "Email Support",
          avatar: "ES"
        },
        text: "Great! I'll mark this ticket as resolved. Feel free to reopen if you encounter any further issues.",
        timestamp: "2023-05-08T13:15:00"
      }
    ]
  },
  {
    id: "HD-1004",
    title: "Printer not connecting",
    status: "Open",
    priority: "Medium",
    category: "Hardware",
    createdBy: {
      name: "Demi Wilkinson",
      avatar: "DW"
    },
    assignedTo: {
      name: "Technical Support",
      avatar: "TS"
    },
    created: "2023-05-07T11:00:00",
    updated: "2023-05-07T11:00:00",
    description: "I'm unable to connect to the shared printer in our department. My computer doesn't detect it.",
    comments: []
  },
  {
    id: "HD-1005",
    title: "Need software installation",
    status: "Closed",
    priority: "Low",
    category: "Software",
    createdBy: {
      name: "Candice Wu",
      avatar: "CW"
    },
    assignedTo: {
      name: "Software Support",
      avatar: "SS"
    },
    created: "2023-05-06T09:30:00",
    updated: "2023-05-06T14:20:00",
    description: "I need Adobe Photoshop installed on my workstation for the upcoming marketing project.",
    comments: [
      {
        id: 1,
        user: {
          name: "Software Support",
          avatar: "SS"
        },
        text: "We've processed your request. A technician will install the software remotely today.",
        timestamp: "2023-05-06T10:15:00"
      },
      {
        id: 2,
        user: {
          name: "Software Support",
          avatar: "SS"
        },
        text: "The software has been installed successfully. Please try it and let us know if you encounter any issues.",
        timestamp: "2023-05-06T14:15:00"
      }
    ]
  }
];

const HelpDesk = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState(ticketsData);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Hardware"
  });
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleNewTicketSubmit = () => {
    const ticket = {
      id: `HD-${1000 + tickets.length + 1}`,
      title: newTicket.title,
      description: newTicket.description,
      priority: newTicket.priority,
      category: newTicket.category,
      status: "Open",
      createdBy: {
        name: "Current User",
        avatar: "CU"
      },
      assignedTo: {
        name: "Unassigned",
        avatar: "UA"
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      comments: []
    };
    
    setTickets([ticket, ...tickets]);
    setNewTicket({
      title: "",
      description: "",
      priority: "Medium",
      category: "Hardware"
    });
    setIsNewTicketOpen(false);
    
    toast({
      title: "Ticket created",
      description: `Ticket #${ticket.id} has been created successfully.`
    });
  };

  const handleViewTicket = (ticket: any) => {
    setCurrentTicket(ticket);
    setIsTicketDetailOpen(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: currentTicket.comments.length + 1,
      user: {
        name: "Current User",
        avatar: "CU"
      },
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    const updatedTicket = {
      ...currentTicket,
      comments: [...currentTicket.comments, comment],
      updated: new Date().toISOString()
    };
    
    setCurrentTicket(updatedTicket);
    setNewComment("");
    
    // Update ticket in the list
    const updatedTickets = tickets.map(t => 
      t.id === updatedTicket.id ? updatedTicket : t
    );
    setTickets(updatedTickets);
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the ticket."
    });
  };

  const changeTicketStatus = (ticketId: string, newStatus: string) => {
    // Update ticket in the list
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus, updated: new Date().toISOString() } : ticket
    );
    
    setTickets(updatedTickets);
    
    // If the current ticket is open, update it too
    if (currentTicket && currentTicket.id === ticketId) {
      setCurrentTicket({ ...currentTicket, status: newStatus, updated: new Date().toISOString() });
    }
    
    toast({
      title: "Status updated",
      description: `Ticket #${ticketId} status changed to ${newStatus}.`
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "In Progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "Resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "Closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "Medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Filter by tab
    if (activeTab !== "all" && ticket.status.toLowerCase() !== activeTab) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Help Desk</h1>
              <p className="text-gray-500">Manage and track support tickets</p>
            </div>
            <Button onClick={() => setIsNewTicketOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search tickets..."
                    className="pl-8 w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Ticket ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.length > 0 ? (
                          filteredTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell className="font-medium">{ticket.id}</TableCell>
                              <TableCell>{ticket.title}</TableCell>
                              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                              <TableCell>{ticket.category}</TableCell>
                              <TableCell>{formatDate(ticket.created)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewTicket(ticket)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:ml-2">View</span>
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="pointer-events-auto">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {ticket.status !== "Open" && (
                                        <DropdownMenuItem onClick={() => changeTicketStatus(ticket.id, "Open")}>
                                          Mark as Open
                                        </DropdownMenuItem>
                                      )}
                                      {ticket.status !== "In Progress" && (
                                        <DropdownMenuItem onClick={() => changeTicketStatus(ticket.id, "In Progress")}>
                                          Mark as In Progress
                                        </DropdownMenuItem>
                                      )}
                                      {ticket.status !== "Resolved" && (
                                        <DropdownMenuItem onClick={() => changeTicketStatus(ticket.id, "Resolved")}>
                                          Mark as Resolved
                                        </DropdownMenuItem>
                                      )}
                                      {ticket.status !== "Closed" && (
                                        <DropdownMenuItem onClick={() => changeTicketStatus(ticket.id, "Closed")}>
                                          Mark as Closed
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                              No tickets found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Submit a new support ticket for technical assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Brief description of the issue"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newTicket.category} 
                  onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Access Request">Access Request</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide details about the issue you're experiencing"
                rows={5}
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attachments">Attachments (optional)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
              <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: PDF, JPG, PNG</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
            <Button onClick={handleNewTicketSubmit}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          {currentTicket && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">{currentTicket.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">{currentTicket.id}</span>
                      <span>•</span>
                      {getStatusBadge(currentTicket.status)}
                    </div>
                  </div>
                  <div>
                    <Select 
                      value={currentTicket.status} 
                      onValueChange={(value) => changeTicketStatus(currentTicket.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent className="pointer-events-auto">
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Reported by</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{currentTicket.createdBy.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{currentTicket.createdBy.name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Assigned to</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{currentTicket.assignedTo.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{currentTicket.assignedTo.name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Created</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(currentTicket.created)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Priority</h4>
                    <div>{getPriorityBadge(currentTicket.priority)}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    {currentTicket.description}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Comments ({currentTicket.comments.length})</h3>
                  <div className="space-y-4 max-h-[300px] overflow-auto">
                    {currentTicket.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    {currentTicket.comments.length === 0 && (
                      <div className="text-sm text-gray-500 py-3 text-center">
                        No comments yet
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Add Comment</h3>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>CU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea 
                        placeholder="Type your comment here..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleAddComment}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpDesk;
