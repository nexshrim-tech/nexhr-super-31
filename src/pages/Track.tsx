
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LocationMap from "@/components/LocationMap";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    location: { lat: 48.8576, lng: 2.3353 }
  }
];

const Track = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingEmployeeId, setTrackingEmployeeId] = useState<number | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleTrackLocation = (employeeId: number) => {
    setTrackingEmployeeId(employeeId);
    toast({
      title: "Location tracking activated",
      description: `Now tracking employee ${employeeId}'s location in real-time.`,
    });
  };

  const filteredEmployees = employees.filter(
    (employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex gap-3 w-full md:w-auto">
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
              <Link to="/">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
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
                            
                            <Button 
                              className={`w-full mt-4 ${
                                trackingEmployeeId === employee.id 
                                  ? "bg-green-500 hover:bg-green-600" 
                                  : ""
                              }`} 
                              size="sm"
                              onClick={() => handleTrackLocation(employee.id)}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              {trackingEmployeeId === employee.id ? "Tracking..." : "Track Location"}
                            </Button>
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
