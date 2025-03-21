
import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Video, Link as LinkIcon, User, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GoogleMeetIntegration from "@/components/GoogleMeetIntegration";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";

const Meetings = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    organizer: 0,
    meetingUrl: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { features } = useSubscription();
  
  // Fetch meetings and employees on component mount
  useEffect(() => {
    if (user) {
      fetchMeetings();
      fetchEmployees();
    }
  }, [user]);
  
  // Fetch meetings from database
  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          meetingid,
          meetingtitle,
          meetingdescription,
          meetingdate,
          starttime,
          custommeetingurl,
          organizeremployeeid,
          employee:organizeremployeeid (
            firstname,
            lastname
          )
        `)
        .order('meetingdate', { ascending: true });
      
      if (error) throw error;
      
      setMeetings(data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive"
      });
    }
  };
  
  // Fetch employees from database
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee')
        .select('employeeid, firstname, lastname')
        .order('firstname', { ascending: true });
      
      if (error) throw error;
      
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  
  // Handle meeting URL from Google Meet integration
  const handleMeetingUrlCreated = (url: string) => {
    setFormData(prev => ({
      ...prev,
      meetingUrl: url
    }));
  };
  
  // Create new meeting
  const createMeeting = async () => {
    if (!formData.title || !formData.date || !formData.organizer) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format date for database
      const meetingDate = format(formData.date, "yyyy-MM-dd'T'HH:mm:ss");
      
      const { data, error } = await supabase
        .from('meetings')
        .insert([
          {
            meetingtitle: formData.title,
            meetingdescription: formData.description,
            meetingdate: meetingDate,
            starttime: meetingDate, // For simplicity, using same field
            custommeetingurl: formData.meetingUrl,
            organizeremployeeid: formData.organizer
          }
        ])
        .select();
      
      if (error) throw error;
      
      setIsDialogOpen(false);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        organizer: 0,
        meetingUrl: ""
      });
      
      // Refresh meetings list
      fetchMeetings();
      
      toast({
        title: "Meeting scheduled",
        description: "Your meeting has been scheduled successfully",
      });
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete meeting
  const deleteMeeting = async (meetingId: number) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('meetingid', meetingId);
      
      if (error) throw error;
      
      // Refresh meetings list
      setMeetings(meetings.filter(meeting => meeting.meetingid !== meetingId));
      
      toast({
        title: "Meeting deleted",
        description: "The meeting has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    }
  };
  
  // Feature check - only accessible with subscription
  if (!features.projectManagement) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserHeader title="Meetings" />
          <main className="flex-1 p-6 overflow-y-auto">
            <FeatureLock 
              title="Meeting Management" 
              description="Upgrade your plan to access meeting scheduling and management features."
            />
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Meetings" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Scheduled Meetings</h1>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
            
            {meetings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
                <p className="text-gray-500 mb-6">Schedule your first meeting to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                  <Card key={meeting.meetingid} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-nexhr-primary/10 to-purple-100 pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{meeting.meetingtitle}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => deleteMeeting(meeting.meetingid)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2 text-nexhr-primary" />
                          <span>
                            {meeting.meetingdate ? format(new Date(meeting.meetingdate), 'MMMM d, yyyy') : 'Date not set'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-nexhr-primary" />
                          <span>
                            {meeting.starttime ? format(new Date(meeting.starttime), 'h:mm a') : 'Time not set'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-2 text-nexhr-primary" />
                          <span>
                            {meeting.employee ? 
                              `${meeting.employee.firstname} ${meeting.employee.lastname}` : 
                              'Organizer not assigned'}
                          </span>
                        </div>
                        {meeting.custommeetingurl && (
                          <div className="mt-4">
                            <a
                              href={meeting.custommeetingurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-nexhr-primary hover:underline"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Join Meeting
                              <LinkIcon className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                        {meeting.meetingdescription && (
                          <div className="mt-2 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {meeting.meetingdescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Create a new virtual meeting for your team
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Weekly Team Sync"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="organizer">Organizer</Label>
              <select
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={0}>Select an organizer</option>
                {employees.map(employee => (
                  <option key={employee.employeeid} value={employee.employeeid}>
                    {employee.firstname} {employee.lastname}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Meeting Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Meeting agenda and details..."
                rows={3}
              />
            </div>
            
            <GoogleMeetIntegration 
              onMeetingCreated={handleMeetingUrlCreated}
              meetingTitle={formData.title}
              meetingDescription={formData.description}
            />
            
            {formData.meetingUrl && (
              <div className="bg-blue-50 p-3 rounded-md flex items-center">
                <Video className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-blue-700 flex-1 truncate">
                  {formData.meetingUrl}
                </span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createMeeting} disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meetings;
