
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, CalendarDays, Clock, Users, Hash, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Sample employee data for attendee selection
const employees = [
  { id: "emp1", name: "Olivia Rhye", department: "Design" },
  { id: "emp2", name: "Phoenix Baker", department: "Engineering" },
  { id: "emp3", name: "Lana Steiner", department: "Marketing" },
  { id: "emp4", name: "Demi Wilkinson", department: "Product" },
  { id: "emp5", name: "Candice Wu", department: "Finance" },
  { id: "emp6", name: "Natali Craig", department: "HR" },
  { id: "emp7", name: "Drew Cano", department: "Operations" },
  { id: "emp8", name: "Orlando Diggs", department: "Design" },
  { id: "emp9", name: "Erin Donovan", department: "Engineering" },
  { id: "emp10", name: "Aliah Lane", department: "Sales" },
  { id: "emp11", name: "Cristofer Vaccaro", department: "Support" },
  { id: "emp12", name: "Lane Stokes", department: "Marketing" },
];

interface ScheduleMeetingFormProps {
  onSchedule?: (meetingData: any) => void;
}

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({ onSchedule }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    isRecurring: false,
  });
  const { toast } = useToast();

  // Generate random meeting ID on component mount
  useEffect(() => {
    generateMeetingId();
  }, []);

  const generateMeetingId = () => {
    const randomId = "M-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetingId(randomId);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMeetingIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingId(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const toggleAttendee = (attendeeId: string) => {
    setSelectedAttendees(current => 
      current.includes(attendeeId)
        ? current.filter(id => id !== attendeeId)
        : [...current, attendeeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedAttendeeDetails = employees.filter(emp => 
      selectedAttendees.includes(emp.id)
    );
    
    const meetingData = {
      ...formData,
      meetingId,
      attendees: selectedAttendeeDetails
    };
    
    if (onSchedule) {
      onSchedule(meetingData);
    }
    
    toast({
      title: "Meeting Scheduled",
      description: `Meeting "${formData.title}" has been scheduled for ${formData.date}.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule New Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter meeting title" 
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetingId">Meeting ID</Label>
              <div className="flex">
                <Input 
                  id="meetingId" 
                  value={meetingId} 
                  onChange={handleMeetingIdChange}
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
              <p className="text-xs text-muted-foreground">Auto-generated unique meeting ID (editable)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="date" 
                  name="date"
                  type="date" 
                  className="pl-10"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="startTime" 
                    name="startTime"
                    type="time" 
                    className="pl-10"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="endTime" 
                    name="endTime"
                    type="time" 
                    className="pl-10"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference-room-1">Conference Room 1</SelectItem>
                  <SelectItem value="conference-room-2">Conference Room 2</SelectItem>
                  <SelectItem value="meeting-room-a">Meeting Room A</SelectItem>
                  <SelectItem value="board-room">Board Room</SelectItem>
                  <SelectItem value="online">Online (Teams)</SelectItem>
                  <SelectItem value="online-zoom">Online (Zoom)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Attendees</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAttendees.length > 0 ? `${selectedAttendees.length} selected` : "Select attendees"}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search employees..." 
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>No employees found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-60">
                          {filteredEmployees.map((employee) => (
                            <CommandItem
                              key={employee.id}
                              value={employee.id}
                              onSelect={() => {
                                toggleAttendee(employee.id);
                              }}
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <Checkbox 
                                  checked={selectedAttendees.includes(employee.id)}
                                  onCheckedChange={() => toggleAttendee(employee.id)}
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{employee.name}</p>
                                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedAttendees.includes(employee.id) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedAttendees.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedAttendees.length} employee{selectedAttendees.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description"
                placeholder="Enter meeting description" 
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
              <Checkbox 
                id="isRecurring" 
                name="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isRecurring: !!checked }))
                }
              />
              <Label htmlFor="isRecurring" className="font-normal">
                Make this a recurring meeting
              </Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Schedule Meeting</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleMeetingForm;
