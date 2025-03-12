
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, MapPin, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmployeeLocation = () => {
  const [isLive, setIsLive] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Employee Location</CardTitle>
            {isLive && (
              <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 flex items-center gap-1.5">
                <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-red-500"></span>
                Live
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportMap}>
                <Download className="h-4 w-4 mr-2" />
                Export Map
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                toast({
                  title: "Filter applied",
                  description: "Location filter has been applied."
                });
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Filter View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[250px] bg-gray-100 relative overflow-hidden">
          <img 
            src="/lovable-uploads/016a0f11-68a9-490e-8ef9-08b4721cb325.png" 
            alt="Employee Location Map" 
            className="absolute w-full h-full object-cover"
          />
          
          {/* Map markers with tooltips */}
          <div className="absolute left-[25%] top-[45%] group cursor-pointer">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <p className="font-medium">Chisom Chukwukwe</p>
              <p>Main Office, Floor 2</p>
            </div>
          </div>
          
          <div className="absolute left-[45%] top-[30%] group cursor-pointer">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-green-100 rounded-full"></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <p className="font-medium">David Cooper</p>
              <p>Conference Room A</p>
            </div>
          </div>
          
          <div className="absolute left-[65%] top-[50%] group cursor-pointer">
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-100 rounded-full"></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <p className="font-medium">Sarah Miller</p>
              <p>Cafeteria</p>
            </div>
          </div>
          
          <div className="absolute left-[35%] top-[65%] group cursor-pointer">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-100 rounded-full"></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <p className="font-medium">Michael Johnson</p>
              <p>Reception Area</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent h-20 pointer-events-none"></div>
          
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <Button 
              size="sm" 
              variant={isLive ? "default" : "outline"}
              className={isLive ? "bg-red-500 hover:bg-red-600" : "bg-white/80 backdrop-blur-sm"}
              onClick={toggleLiveTracking}
            >
              {isLive ? "Stop Tracking" : "Start Live Tracking"}
            </Button>
            
            <Link to="/track">
              <Button size="sm" className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm">
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
