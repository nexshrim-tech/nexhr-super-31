
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LocationMap from "@/components/LocationMap";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Map, 
  MapPin, 
  Search, 
  Filter, 
  Download,
  Printer
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const employees = [
  {
    id: 1,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    role: "UI/UX Designer",
    phone: "+369 258 147",
    email: "work@email.com",
    employeeId: "5278429811",
    status: "Online",
    department: "Design",
    location: { lat: 48.8606, lng: 2.3376 } // Near Louvre Museum in Paris
  },
  {
    id: 2,
    name: "David Cooper",
    avatar: "DC",
    role: "Project Manager",
    phone: "+123 456 789",
    email: "david@email.com",
    employeeId: "4278429812",
    status: "Online",
    department: "Management",
    location: { lat: 48.8622, lng: 2.3330 }
  },
  {
    id: 3,
    name: "Sarah Miller",
    avatar: "SM",
    role: "Frontend Developer",
    phone: "+987 654 321",
    email: "sarah@email.com",
    employeeId: "3278429813",
    status: "Away",
    department: "Engineering",
    location: { lat: 48.8599, lng: 2.3409 }
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "MJ",
    role: "Backend Developer",
    phone: "+456 789 123",
    email: "michael@email.com",
    employeeId: "2278429814",
    status: "Offline",
    department: "Engineering",
    location: { lat: 48.8576, lng: 2.3353 }
  }
];

const Track = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingEmployeeId, setTrackingEmployeeId] = useState<number | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("tracking");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleTrackLocation = (employeeId: number) => {
    setTrackingEmployeeId(employeeId);
    toast({
      title: "Location tracking activated",
      description: `Now tracking employee ${employeeId}'s location in real-time.`,
    });
  };

  const handleGenerateDocument = () => {
    setIsGeneratingDocument(true);
    // Simulate document generation
    setTimeout(() => {
      setIsGeneratingDocument(false);
      toast({
        title: "Document generated",
        description: `${selectedDocType.charAt(0).toUpperCase() + selectedDocType.slice(1)} report has been generated successfully.`,
      });
    }, 1500);
  };

  const filteredEmployees = employees.filter(
    (employee) => {
      // Apply search filter
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.includes(searchTerm) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply department filter
      const matchesDepartment = departmentFilter === "all" || 
                              employee.department.toLowerCase() === departmentFilter.toLowerCase();
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || 
                          employee.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesDepartment && matchesStatus;
    }
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Employee Tracking</h1>
              <p className="text-gray-500">Monitor employee locations in real-time</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  className="pl-9 w-full" 
                  placeholder="Search employees..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} -{" "}
                          {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd")
                      )
                    ) : (
                      <span>Date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Tracking Report</DialogTitle>
                    <DialogDescription>
                      Create a document with employee tracking data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Tabs defaultValue="tracking" onValueChange={setSelectedDocType}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="tracking">Tracking</TabsTrigger>
                          <TabsTrigger value="attendance">Attendance</TabsTrigger>
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tracking" className="space-y-4 pt-4">
                          <p className="text-sm text-gray-500">Generate a detailed tracking report showing employee locations for the selected date range.</p>
                        </TabsContent>
                        <TabsContent value="attendance" className="space-y-4 pt-4">
                          <p className="text-sm text-gray-500">Create an attendance report based on tracking data for the selected date range.</p>
                        </TabsContent>
                        <TabsContent value="summary" className="space-y-4 pt-4">
                          <p className="text-sm text-gray-500">Generate a summary of all employee movements and locations.</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Calendar className="h-4 w-4 mr-2" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "PPP")} -{" "}
                                  {format(dateRange.to, "PPP")}
                                </>
                              ) : (
                                format(dateRange.from, "PPP")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Include Employees</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Employees</SelectItem>
                          <SelectItem value="selected">Selected Employees</SelectItem>
                          <SelectItem value="department">By Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      className="gap-2" 
                      onClick={handleGenerateDocument}
                      disabled={isGeneratingDocument}
                    >
                      {isGeneratingDocument ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Generate Document
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link to="/">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <Card className="w-full lg:w-auto flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={() => {
                    setSearchTerm("");
                    setDepartmentFilter("all");
                    setStatusFilter("all");
                  }}>
                    <Filter className="h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full lg:w-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setTrackingEmployeeId(null)}
                    className="flex-1 sm:flex-none"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      toast({
                        title: "Printed",
                        description: "Current map view has been sent to printer."
                      });
                    }}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Employee List</CardTitle>
                </CardHeader>
                <CardContent className="px-3">
                  <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-2">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(employee => (
                        <div 
                          key={employee.id} 
                          className={`border rounded-lg overflow-hidden bg-white transition-all duration-200 hover:shadow-md ${
                            trackingEmployeeId === employee.id ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt={employee.name} />
                                <AvatarFallback>{employee.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{employee.name}</p>
                                  <Badge variant="outline" className={`ml-2 flex items-center gap-1.5`}>
                                    <span className={`h-2 w-2 rounded-full ${getStatusColor(employee.status)}`}></span>
                                    {employee.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{employee.role}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-sm space-y-1.5">
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="truncate">{employee.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <span className="truncate">{employee.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                <span className="truncate">ID: {employee.employeeId}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button 
                                className={`flex-1 ${
                                  trackingEmployeeId === employee.id 
                                    ? "bg-green-500 hover:bg-green-600" 
                                    : ""
                                }`} 
                                size="sm"
                                onClick={() => handleTrackLocation(employee.id)}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                {trackingEmployeeId === employee.id ? "Tracking..." : "Track"}
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Employee Profile</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-16 w-16">
                                        <AvatarFallback>{employee.avatar}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-lg font-semibold">{employee.name}</h3>
                                        <p className="text-gray-500">{employee.role}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Employee ID</p>
                                        <p className="font-medium">{employee.employeeId}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="font-medium">{employee.department}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{employee.phone}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{employee.email}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No employees found matching "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    {trackingEmployeeId 
                      ? `Tracking ${employees.find(e => e.id === trackingEmployeeId)?.name}` 
                      : "Employee Location Map"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(100vh-250px)] rounded-b-lg overflow-hidden">
                    <LocationMap employeeId={trackingEmployeeId || undefined} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
