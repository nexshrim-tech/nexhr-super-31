
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, MapPin, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationMapComponent from "./LocationMapComponent";

interface EmployeeLocation {
  employeeid: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

const EmployeeLocation = () => {
  const [isLive, setIsLive] = useState(false);
  const [employeeLocations, setEmployeeLocations] = useState<EmployeeLocation[]>([]);
  const isMobile = useIsMobile();
  
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['employee-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('track')
        .select('*, employee:employeeid(firstname, lastname, jobtitle)')
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Error fetching location data:', error);
        throw error;
      }
      
      return (data || []) as EmployeeLocation[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    setEmployeeLocations(locations);
  }, [locations]);
  
  useEffect(() => {
    if (isLive) {
      // Set up real-time listener for location changes
      const channel = supabase
        .channel('track-changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'track'
          },
          async (payload) => {
            console.log('Track data changed:', payload);
            
            // Fetch the latest data including the employee details
            const { data } = await supabase
              .from('track')
              .select('*, employee:employeeid(firstname, lastname, jobtitle)')
              .eq('trackid', payload.new.trackid)
              .single();
              
            if (data) {
              // Update the locations state
              setEmployeeLocations(prevLocations => {
                const existingIndex = prevLocations.findIndex(
                  loc => loc.employeeid === data.employeeid
                );
                
                if (existingIndex >= 0) {
                  // Update existing employee location
                  const updatedLocations = [...prevLocations];
                  updatedLocations[existingIndex] = data as EmployeeLocation;
                  return updatedLocations;
                } else {
                  // Add new employee location
                  return [...prevLocations, data as EmployeeLocation];
                }
              });
              
              toast.info(`${data.employee?.firstname || 'Employee'} location updated`);
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLive]);
  
  const toggleLiveTracking = () => {
    setIsLive(!isLive);
    
    toast({
      title: isLive ? "Live tracking stopped" : "Live tracking started",
      description: isLive 
        ? "You have stopped tracking employee locations in real-time." 
        : "You are now tracking employee locations in real-time."
    });
  };

  const handleExportMap = () => {
    toast({
      title: "Map exported",
      description: "The current map view has been exported.",
    });
  };

  return (
    <Card className="overflow-hidden shadow-md border-t-2 border-t-nexhr-primary">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-full">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Employee Location</CardTitle>
              {isLive && (
                <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 flex items-center gap-1.5 mt-1">
                  <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-red-500"></span>
                  Live Tracking
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border shadow-lg">
              <DropdownMenuItem onClick={handleExportMap} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Export Map
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                toast({
                  title: "Filter applied",
                  description: "Location filter has been applied."
                });
              }} className="cursor-pointer">
                <Filter className="h-4 w-4 mr-2" />
                Filter View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[280px] relative overflow-hidden">
          <LocationMapComponent 
            employeeLocations={employeeLocations}
            isLoading={isLoading}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20 pointer-events-none"></div>
          
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <Button 
              size="sm" 
              variant={isLive ? "default" : "outline"}
              className={isLive 
                ? "bg-red-500 hover:bg-red-600 shadow-md" 
                : "bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"}
              onClick={toggleLiveTracking}
            >
              {isLive ? "Stop Tracking" : "Start Live Tracking"}
            </Button>
            
            <Link to="/track">
              <Button 
                size="sm" 
                className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm shadow-md hover:bg-primary"
              >
                <Users className="h-3.5 w-3.5" />
                {isMobile ? "View All" : "View All Employees"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeLocation;
