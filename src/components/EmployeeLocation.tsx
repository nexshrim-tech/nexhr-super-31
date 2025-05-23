
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

export interface EmployeeLocationData {
  employeeid: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  track_id: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

const EmployeeLocation = () => {
  const [isLive, setIsLive] = useState(false);
  const [employeeLocations, setEmployeeLocations] = useState<EmployeeLocationData[]>([]);
  const isMobile = useIsMobile();
  
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['employee-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('track')
        .select('*, employee:employee!track_employeeid_fkey(firstname, lastname, jobtitle)')
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Error fetching location data:', error);
        throw error;
      }
      
      return (data || []).map(item => ({
        employeeid: item.employeeid,
        latitude: item.coordinates?.[0] || 0,
        longitude: item.coordinates?.[1] || 0,
        timestamp: item.timestamp || '',
        track_id: item.track_id,
        employee: item.employee || undefined
      })) as EmployeeLocationData[];
    },
    staleTime: 5 * 60 * 1000,
  });
  
  useEffect(() => {
    if (locations) {
      setEmployeeLocations(locations);
    }
  }, [locations]);
  
  useEffect(() => {
    if (isLive) {
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
            
            if (payload.new && typeof payload.new === 'object' && 'track_id' in payload.new) {
              const { data } = await supabase
                .from('track')
                .select('*, employee:employee!track_employeeid_fkey(firstname, lastname, jobtitle)')
                .eq('track_id', payload.new.track_id)
                .single();
                
              if (data) {
                const transformedData: EmployeeLocationData = {
                  employeeid: data.employeeid,
                  latitude: data.coordinates?.[0] || 0,
                  longitude: data.coordinates?.[1] || 0,
                  timestamp: data.timestamp || '',
                  track_id: data.track_id,
                  employee: data.employee || undefined
                };
                
                setEmployeeLocations(prevLocations => {
                  const existingIndex = prevLocations.findIndex(
                    loc => loc.employeeid === transformedData.employeeid
                  );
                  
                  if (existingIndex >= 0) {
                    const updatedLocations = [...prevLocations];
                    updatedLocations[existingIndex] = transformedData;
                    return updatedLocations;
                  } else {
                    return [...prevLocations, transformedData];
                  }
                });
                
                toast(`${data.employee?.firstname || 'Employee'} location updated`);
              }
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
    
    toast(isLive 
      ? "You have stopped tracking employee locations in real-time." 
      : "You are now tracking employee locations in real-time."
    );
  };

  const handleExportMap = () => {
    toast("The current map view has been exported.");
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
              <DropdownMenuItem onClick={() => toast("The current map view has been exported.")} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Export Map
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                toast("Location filter has been applied.");
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
              onClick={() => {
                setIsLive(!isLive);
                toast(isLive 
                  ? "You have stopped tracking employee locations in real-time." 
                  : "You are now tracking employee locations in real-time."
                );
              }}
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
