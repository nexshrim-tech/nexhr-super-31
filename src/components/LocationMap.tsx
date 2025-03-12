
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Download, Maximize, Minimize, Info, UserPlus, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface LocationMapProps {
  employeeId?: number;
  defaultView?: boolean;
}

// Mock employee data for the map
const employees = [
  {
    id: 1,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    position: { left: "25%", top: "45%" },
    color: "blue",
    lastSeen: "2 mins ago",
    location: "Main Office, Floor 2"
  },
  {
    id: 2,
    name: "David Cooper",
    avatar: "DC",
    position: { left: "45%", top: "30%" },
    color: "green",
    lastSeen: "Just now",
    location: "Conference Room A"
  },
  {
    id: 3,
    name: "Sarah Miller",
    avatar: "SM",
    position: { left: "65%", top: "50%" },
    color: "yellow",
    lastSeen: "5 mins ago",
    location: "Cafeteria"
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "MJ",
    position: { left: "55%", top: "65%" },
    color: "purple",
    lastSeen: "15 mins ago",
    location: "Reception Area"
  }
];

const LocationMap = ({ employeeId, defaultView = true }: LocationMapProps) => {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHistorical, setShowHistorical] = useState(false);

  useEffect(() => {
    if (employeeId) {
      setSelectedEmployee(employeeId);
    } else {
      setSelectedEmployee(null);
    }
  }, [employeeId]);

  const handleViewFullMap = () => {
    setIsFullscreen(true);
    toast({
      title: "Full map view activated",
      description: "You can now see all employee locations in detail."
    });
  };

  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.7) {
      setZoomLevel(zoomLevel - 0.1);
    }
  };

  const getMarkerStyle = (employeeId: number) => {
    const isSelected = selectedEmployee === employeeId;
    const size = isSelected ? "w-6 h-6" : "w-5 h-5";
    const innerSize = isSelected ? "w-4 h-4" : "w-3 h-3";
    const animation = isSelected ? "animate-pulse" : "";
    
    return { size, innerSize, animation };
  };

  return (
    <div 
      className={`${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black/50 flex items-center justify-center' : 'h-full'}`}
    >
      <div 
        className={`bg-white border rounded-md ${isFullscreen ? 'w-full h-full max-w-7xl max-h-[90vh]' : 'h-full'} relative overflow-hidden`}
      >
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button 
              className="gap-2" 
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize className="h-4 w-4" />
              Exit Fullscreen
            </Button>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
            onClick={() => setShowHistorical(!showHistorical)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {showHistorical ? "Hide History" : "Show History"}
          </Button>
          
          {selectedEmployee && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm py-1 px-3">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full bg-${employees.find(e => e.id === selectedEmployee)?.color}-500 animate-pulse`}></div>
                <span>Tracking: {employees.find(e => e.id === selectedEmployee)?.name}</span>
              </div>
            </Badge>
          )}
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm"
            onClick={handleZoomIn}
          >
            +
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm"
            onClick={handleZoomOut}
          >
            -
          </Button>
        </div>
        
        <div className={`w-full h-full relative overflow-hidden`} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}>
          <img 
            src="/lovable-uploads/5f84f812-bedb-480e-ac18-b71a9a3e45e8.png" 
            alt="Map with employee locations" 
            className="w-full h-full object-cover transition-transform"
          />
          
          {/* Map markers */}
          {employees.map(employee => {
            // If an employee is selected, only show that employee
            if (selectedEmployee && employee.id !== selectedEmployee) return null;
            
            const markerStyle = getMarkerStyle(employee.id);
            return (
              <TooltipProvider key={employee.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`absolute cursor-pointer ${markerStyle.animation}`}
                      style={{ left: employee.position.left, top: employee.position.top }}
                      onClick={() => setSelectedEmployee(employee.id === selectedEmployee ? null : employee.id)}
                    >
                      <div className={`${markerStyle.size} bg-${employee.color}-500 rounded-full flex items-center justify-center`}>
                        <div className={`${markerStyle.innerSize} bg-${employee.color}-100 rounded-full`}></div>
                      </div>
                      
                      {showHistorical && (
                        <div className={`absolute -z-10 ${employee.color === 'purple' ? 'border-purple-300' : `border-${employee.color}-300`} border-2 border-dashed rounded-full w-24 h-24 -translate-x-1/2 -translate-y-1/2 opacity-40`} style={{ left: '50%', top: '50%' }}></div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-sm">
                      <p className="font-semibold">{employee.name}</p>
                      <p>{employee.location}</p>
                      <p className="text-gray-500">Last seen: {employee.lastSeen}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          
          {/* Historical paths example (shown when showHistorical is true) */}
          {showHistorical && (
            <>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path 
                  d="M25%,45% Q35%,40% 45%,30%" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
                <path 
                  d="M65%,50% Q60%,60% 55%,65%" 
                  stroke="#eab308" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
              </svg>
            </>
          )}
        </div>
        
        {!isFullscreen && defaultView && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>This map shows the real-time location of employees</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm" 
              onClick={handleViewFullMap}
              size={isMobile ? "sm" : "default"}
            >
              <Maximize className="h-4 w-4 mr-2" />
              {isMobile ? "Expand" : "View full map"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
