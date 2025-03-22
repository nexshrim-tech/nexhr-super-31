
import React, { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Link2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  Video,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Hash,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, setHours, setMinutes, parse, isToday, isTomorrow, isYesterday } from "date-fns";

// Sample data
const sampleEmployees = [
  { id: 1, name: "Olivia Rhye", avatar: "OR", email: "olivia@example.com" },
  { id: 2, name: "Phoenix Baker", avatar: "PB", email: "phoenix@example.com" },
  { id: 3, name: "Lana Steiner", avatar: "LS", email: "lana@example.com" },
  { id: 4, name: "Demi Wilkinson", avatar: "DW", email: "demi@example.com" },
  { id: 5, name: "Candice Wu", avatar: "CW", email: "candice@example.com" },
];

const meetingStatuses = {
  upcoming: "bg-blue-100 text-blue-800",
  live: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const sampleMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    description: "Review progress on current projects and discuss blockers",
    startTime: format(setMinutes(setHours(new Date(), 10), 0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setMinutes(setHours(new Date(), 10), 30), "yyyy-MM-dd'T'HH:mm"),
    attendees: [1, 2, 3, 4, 5],
    status: "upcoming",
    meetUrl: "https://meet.google.com/abc-defg-hij",
    meetingId: "M-ABC123",
  },
  {
    id: 2,
    title: "Project Planning Meeting",
    description: "Discuss timeline and resources for the new HR portal project",
    startTime: format(setMinutes(setHours(addDays(new Date(), 1), 14), 0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setMinutes(setHours(addDays(new Date(), 1), 15), 0), "yyyy-MM-dd'T'HH:mm"),
    attendees: [1, 3, 5],
    status: "upcoming",
    meetUrl: "https://meet.google.com/klm-nopq-rst",
    meetingId: "M-DEF456",
  },
  {
    id: 3,
    title: "Interview: Senior Developer",
    description: "Technical interview for the Senior Frontend Developer position",
    startTime: format(setMinutes(setHours(addDays(new Date(), -1), 11), 0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(setMinutes(setHours(addDays(new Date(), -1), 12), 30), "yyyy-MM-dd'T'HH:mm"),
    attendees: [2, 4],
    status: "completed",
    meetUrl: "https://meet.google.com/uvw-xyz-123",
    meetingId: "M-GHI789",
  },
];

const Meetings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [meetings, setMeetings] = useState(sampleMeetings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
  const [isJoinMeetingOpen, setIsJoinMeetingOpen] = useState(false);
  const { toast } = useToast();

  // New meeting form state
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    attendees: [] as number[],
    meetUrl: ""
  });

  // Meeting ID state
  const [meetingId, setMeetingId] = useState("");
  const [searchAttendees, setSearchAttendees] = useState("");

  // Generate random meeting ID on dialog open
  useEffect(() => {
    if (isCreateMeetingOpen) {
      generateMeetingId();
    }
  }, [isCreateMeetingOpen]);

  const generateMeetingId = () => {
    const randomId = "M-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetingId(randomId);
  };

  const handleCreateMeeting = () => {
    if (!newMeeting.title) {
      toast({
        title: "Meeting title required",
        description: "Please enter a title for the meeting",
        variant: "destructive"
      });
      return;
    }

    // Combine date and time for start and end
    const startDate = parse(`${newMeeting.date} ${newMeeting.startTime}`, "yyyy-MM-dd HH:mm", new Date());
    const endDate = parse(`${newMeeting.date} ${newMeeting.endTime}`, "yyyy-MM-dd HH:mm", new Date());
    
    // Validate times
    if (endDate <= startDate) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    // Generate a mock Google Meet URL
    const mockMeetUrl = "https://meet.google.com/" + 
      Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6);

    const meeting = {
      id: meetings.length + 1,
      title: newMeeting.title,
      description: newMeeting.description,
      startTime: format(startDate, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(endDate, "yyyy-MM-dd'T'HH:mm"),
      attendees: newMeeting.attendees.length > 0 ? newMeeting.attendees : [1], // Default to current user
      status: "upcoming",
      meetUrl: newMeeting.meetUrl || mockMeetUrl,
      meetingId: meetingId
    };

    setMeetings([...meetings, meeting]);
    setIsCreateMeetingOpen(false);
    setNewMeeting({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      attendees: [],
      meetUrl: ""
    });

    toast({
      title: "Meeting scheduled",
      description: `${meeting.title} has been scheduled successfully with ID: ${meetingId}`
    });
  };

  const handleJoinMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsJoinMeetingOpen(true);
  };

  const handleCopyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard"
    });
  };

  // Filter meetings based on search and tab
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = !searchTerm || 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For date filter, check if meeting is on selected date
    const meetingDate = new Date(meeting.startTime).toDateString();
    const selectedDateStr = selectedDate ? selectedDate.toDateString() : '';
    const matchesDate = !selectedDate || meetingDate === selectedDateStr;
    
    // For tab filter
    let matchesTab = true;
    if (activeTab === "upcoming") {
      matchesTab = meeting.status === "upcoming" || meeting.status === "live";
    } else if (activeTab === "past") {
      matchesTab = meeting.status === "completed" || meeting.status === "cancelled";
    }
    
    return matchesSearch && matchesDate && matchesTab;
  });

  // Filter employees for attendee selection
  const filteredEmployees = sampleEmployees.filter(employee => 
    !searchAttendees || 
    employee.name.toLowerCase().includes(searchAttendees.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchAttendees.toLowerCase())
  );

  const formatMeetingTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  const formatMeetingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-semibold">Meetings</h1>
            <p className="text-gray-500">Schedule, manage, and join video conferences</p>
          </div>
          
          <div className="p-4 lg:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search meetings..."
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Dialog open={isCreateMeetingOpen} onOpenChange={setIsCreateMeetingOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule New Meeting</DialogTitle>
                      <DialogDescription>
                        Set up a new video conference meeting
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="meeting-title" className="text-sm font-medium">
                          Meeting Title
                        </label>
                        <Input
                          id="meeting-title"
                          placeholder="Enter meeting title"
                          value={newMeeting.title}
                          onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="meeting-id" className="text-sm font-medium">
                          Meeting ID
                        </label>
                        <div className="flex">
                          <Input
                            id="meeting-id"
                            placeholder="Meeting ID"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            className="flex-1 rounded-r-none border-r-0"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-l-none border-l-0"
                            onClick={generateMeetingId}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Auto-generated meeting ID (editable)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="meeting-description" className="text-sm font-medium">
                          Description (Optional)
                        </label>
                        <Textarea
                          id="meeting-description"
                          placeholder="Enter meeting description"
                          value={newMeeting.description}
                          onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="meeting-date" className="text-sm font-medium">
                          Date
                        </label>
                        <Input
                          id="meeting-date"
                          type="date"
                          value={newMeeting.date}
                          onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="start-time" className="text-sm font-medium">
                            Start Time
                          </label>
                          <Input
                            id="start-time"
                            type="time"
                            value={newMeeting.startTime}
                            onChange={(e) => setNewMeeting({...newMeeting, startTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="end-time" className="text-sm font-medium">
                            End Time
                          </label>
                          <Input
                            id="end-time"
                            type="time"
                            value={newMeeting.endTime}
                            onChange={(e) => setNewMeeting({...newMeeting, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Attendees
                        </label>
                        <div className="relative mb-2">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="search"
                            placeholder="Search employees..."
                            className="pl-8 w-full"
                            value={searchAttendees}
                            onChange={(e) => setSearchAttendees(e.target.value)}
                          />
                        </div>
                        <ScrollArea className="h-[150px] border rounded-md p-2">
                          <div className="space-y-2">
                            {filteredEmployees.map((employee) => (
                              <div key={employee.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`attendee-${employee.id}`}
                                  className="rounded border-gray-300"
                                  checked={newMeeting.attendees.includes(employee.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewMeeting({
                                        ...newMeeting,
                                        attendees: [...newMeeting.attendees, employee.id]
                                      });
                                    } else {
                                      setNewMeeting({
                                        ...newMeeting,
                                        attendees: newMeeting.attendees.filter(id => id !== employee.id)
                                      });
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={`attendee-${employee.id}`}
                                  className="text-sm font-medium flex items-center gap-2"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{employee.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div>{employee.name}</div>
                                    <div className="text-xs text-gray-500">{employee.email}</div>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="meeting-url" className="text-sm font-medium">
                          Custom Meeting URL (Optional)
                        </label>
                        <Input
                          id="meeting-url"
                          placeholder="https://meet.google.com/..."
                          value={newMeeting.meetUrl}
                          onChange={(e) => setNewMeeting({...newMeeting, meetUrl: e.target.value})}
                        />
                        <p className="text-xs text-gray-500">
                          Leave blank to auto-generate a Google Meet link
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateMeetingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateMeeting} disabled={!newMeeting.title}>
                        Schedule Meeting
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                    />
                    <div className="p-4 pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setSelectedDate(new Date())}
                      >
                        Today
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Your Meetings Today</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {meetings.filter(meeting => {
                      const meetingDate = new Date(meeting.startTime).toDateString();
                      const today = new Date().toDateString();
                      return meetingDate === today;
                    }).length > 0 ? (
                      <div className="space-y-3">
                        {meetings
                          .filter(meeting => {
                            const meetingDate = new Date(meeting.startTime).toDateString();
                            const today = new Date().toDateString();
                            return meetingDate === today;
                          })
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                          .map(meeting => (
                            <div key={meeting.id} className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-50">
                              <div className="flex-shrink-0 w-1 h-12 bg-blue-500 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{meeting.title}</p>
                                <p className="text-xs text-gray-500">
                                  {formatMeetingTime(meeting.startTime, meeting.endTime)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {meeting.meetingId}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-shrink-0"
                                onClick={() => handleJoinMeeting(meeting)}
                              >
                                <Video className="h-3.5 w-3.5 mr-1" />
                                Join
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No meetings today</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setIsCreateMeetingOpen(true)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Schedule Meeting
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-3">
                {filteredMeetings.length > 0 ? (
                  <div className="space-y-6">
                    {Array.from(new Set(filteredMeetings.map(m => new Date(m.startTime).toDateString()))).map(dateStr => (
                      <div key={dateStr}>
                        <h3 className="text-lg font-medium mb-3">
                          {formatMeetingDate(dateStr)}
                        </h3>
                        <div className="space-y-4">
                          {filteredMeetings
                            .filter(m => new Date(m.startTime).toDateString() === dateStr)
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .map(meeting => (
                              <Card key={meeting.id} className="overflow-hidden">
                                <div className={`h-1 ${meetingStatuses[meeting.status as keyof typeof meetingStatuses].split(' ')[0]}`} />
                                <CardContent className="p-4">
                                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-medium">{meeting.title}</h4>
                                        <Badge variant="outline" className={meetingStatuses[meeting.status as keyof typeof meetingStatuses]}>
                                          {meeting.status === "upcoming" ? "Upcoming" :
                                           meeting.status === "live" ? "Live Now" :
                                           meeting.status === "completed" ? "Completed" : "Cancelled"}
                                        </Badge>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <div className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1" />
                                          {formatMeetingTime(meeting.startTime, meeting.endTime)}
                                        </div>
                                        <div className="flex items-center">
                                          <Users className="h-4 w-4 mr-1" />
                                          {meeting.attendees.length} attendees
                                        </div>
                                      </div>
                                      
                                      {meeting.description && (
                                        <p className="text-sm mt-2">{meeting.description}</p>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 shrink-0">
                                      {(meeting.status === "upcoming" || meeting.status === "live") && (
                                        <Button 
                                          className="whitespace-nowrap"
                                          onClick={() => handleJoinMeeting(meeting)}
                                        >
                                          <Video className="h-4 w-4 mr-1" />
                                          Join Meeting
                                        </Button>
                                      )}
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem 
                                            className="cursor-pointer"
                                            onClick={() => handleCopyMeetingLink(meeting.meetUrl)}
                                          >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Meeting Link
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="cursor-pointer">
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Meeting
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="cursor-pointer text-red-500">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Cancel Meeting
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                  
                                  <Separator className="my-4" />
                                  
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">Attendees ({meeting.attendees.length})</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {meeting.attendees.map(attendeeId => {
                                        const attendee = sampleEmployees.find(e => e.id === attendeeId);
                                        return attendee ? (
                                          <div key={attendee.id} className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                                            <Avatar className="h-6 w-6">
                                              <AvatarFallback>{attendee.avatar}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{attendee.name}</span>
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No meetings found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm ? "Try adjusting your search terms" : "Schedule a meeting to get started"}
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setIsCreateMeetingOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Join Meeting Dialog */}
          <Dialog open={isJoinMeetingOpen} onOpenChange={setIsJoinMeetingOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Join Meeting</DialogTitle>
                <DialogDescription>
                  {selectedMeeting?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 bg-gray-50 rounded-md mt-2">
                <p className="text-sm font-medium mb-2">Meeting ID: {selectedMeeting?.meetingId}</p>
                <p className="text-sm font-medium mb-2">Meeting Link</p>
                <div className="flex items-center gap-2">
                  <Input value={selectedMeeting?.meetUrl} readOnly />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => selectedMeeting && handleCopyMeetingLink(selectedMeeting.meetUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsJoinMeetingOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    window.open(selectedMeeting?.meetUrl, '_blank');
                    setIsJoinMeetingOpen(false);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Join Meeting
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
