import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Download, Maximize, Minimize, Info, UserPlus, Search, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface LocationMapProps {
  employeeId?: number;
  defaultView?: boolean;
  employee?: {
    id: number;
    name: string;
    role: string;
    location: { lat: number; lng: number } | null;
    lastActive: string;
  };
}

// Mock employee data for the map with timestamps for movement tracking
const employees = [
  {
    id: 1,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    positions: [
      { left: "25%", top: "45%", timestamp: "09:00 AM" },
      { left: "35%", top: "40%", timestamp: "11:30 AM" },
      { left: "45%", top: "35%", timestamp: "02:00 PM" },
    ],
    color: "blue",
    lastSeen: "2 mins ago",
    location: "Main Office, Floor 2"
  },
  {
    id: 2,
    name: "David Cooper",
    avatar: "DC",
    positions: [
      { left: "45%", top: "30%", timestamp: "09:30 AM" },
      { left: "50%", top: "35%", timestamp: "11:45 AM" },
      { left: "55%", top: "40%", timestamp: "01:15 PM" },
    ],
    color: "green",
    lastSeen: "Just now",
    location: "Conference Room A"
  },
  {
    id: 3,
    name: "Sarah Miller",
    avatar: "SM",
    positions: [
      { left: "65%", top: "50%", timestamp: "08:45 AM" },
      { left: "60%", top: "45%", timestamp: "10:30 AM" },
      { left: "55%", top: "40%", timestamp: "03:00 PM" },
    ],
    color: "yellow",
    lastSeen: "5 mins ago",
    location: "Cafeteria"
  },
  {
    id: 4,
    name: "Michael Johnson",
    avatar: "MJ",
    positions: [
      { left: "35%", top: "65%", timestamp: "09:15 AM" },
      { left: "45%", top: "60%", timestamp: "12:00 PM" },
      { left: "55%", top: "65%", timestamp: "04:30 PM" },
    ],
    color: "purple",
    lastSeen: "15 mins ago",
    location: "Reception Area"
  }
];

const LocationMap: React.FC<LocationMapProps> = ({ employee, employeeId, defaultView = true }) => {
  // If employee is provided, use their ID
  const effectiveEmployeeId = employee?.id || employeeId;
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHistorical, setShowHistorical] = useState(true);
  const [viewTimeline, setViewTimeline] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (employeeId) {
      setSelectedEmployee(employeeId);
    } else {
      setSelectedEmployee(null);
    }
  }, [employeeId]);

  useEffect(() => {
    // Reset animation state when historical view changes
    if (showHistorical) {
      setAnimationComplete(false);
      
      // Start animation after a brief delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000); // Animation takes 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showHistorical]);

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

  const handleViewBill = () => {
    toast({
      title: "Bill View",
      description: "Viewing purchase bill for this asset."
    });
  };

  const toggleTimeline = () => {
    setViewTimeline(!viewTimeline);
    toast({
      title: viewTimeline ? "Timeline hidden" : "Timeline activated",
      description: viewTimeline 
        ? "Employee movement timeline is now hidden." 
        : "You can now see the timeline of employee movements."
    });
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
          
          {showHistorical && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
              onClick={toggleTimeline}
            >
              <Eye className="h-4 w-4 mr-2" />
              {viewTimeline ? "Hide Timeline" : "View Timeline"}
            </Button>
          )}
          
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
          
          {/* Animated paths between positions */}
          {showHistorical && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {employees.map(employee => {
                // If an employee is selected, only show that employee's path
                if (selectedEmployee && employee.id !== selectedEmployee) return null;
                
                return employee.positions.length > 1 && (
                  <g key={`path-${employee.id}`}>
                    {employee.positions.slice(0, -1).map((pos, index) => {
                      const nextPos = employee.positions[index + 1];
                      return (
                        <path 
                          key={`segment-${employee.id}-${index}`}
                          d={`M${pos.left},${pos.top} L${nextPos.left},${nextPos.top}`}
                          stroke={`var(--${employee.color}-500, #3b82f6)`}
                          strokeWidth="2"
                          strokeDasharray="10,5"
                          fill="none"
                          className={`${animationComplete ? 'opacity-60' : 'opacity-0'}`}
                          style={{
                            strokeDashoffset: animationComplete ? 0 : 100,
                            transition: 'stroke-dashoffset 2s ease, opacity 0.5s ease',
                          }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          )}
          
          {/* Movement timeline */}
          {showHistorical && viewTimeline && (
            <div className="absolute bottom-16 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-md border z-10">
              <h4 className="text-sm font-medium mb-2">Movement Timeline</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {employees.map(employee => {
                  // If an employee is selected, only show that employee's timeline
                  if (selectedEmployee && employee.id !== selectedEmployee) return null;
                  
                  return (
                    <div key={`timeline-${employee.id}`}>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <span className={`inline-block w-2 h-2 rounded-full bg-${employee.color}-500`}></span>
                        {employee.name}
                      </p>
                      <div className="pl-4 space-y-1 mt-1">
                        {employee.positions.map((pos, index) => (
                          <p key={`time-${employee.id}-${index}`} className="text-xs text-gray-600 flex justify-between">
                            <span>{pos.timestamp}</span>
                            <span className="text-gray-500">
                              {index === 0 
                                ? 'Started' 
                                : index === employee.positions.length - 1 
                                  ? 'Current location' 
                                  : `Position ${index + 1}`}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Map markers */}
          {employees.map(employee => {
            // If an employee is selected, only show that employee
            if (selectedEmployee && employee.id !== selectedEmployee) return null;
            
            // Get the current position (last in the array)
            const currentPosition = employee.positions[employee.positions.length - 1];
            const markerStyle = getMarkerStyle(employee.id);
            
            return (
              <TooltipProvider key={employee.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`absolute cursor-pointer ${markerStyle.animation} z-20`}
                      style={{ 
                        left: currentPosition.left, 
                        top: currentPosition.top,
                        transition: 'left 1s ease-out, top 1s ease-out'
                      }}
                      onClick={() => setSelectedEmployee(employee.id === selectedEmployee ? null : employee.id)}
                    >
                      {/* Pin for latest location */}
                      <div className="relative">
                        <div className={`${markerStyle.size} bg-${employee.color}-500 rounded-full flex items-center justify-center`}>
                          <div className={`${markerStyle.innerSize} bg-${employee.color}-100 rounded-full`}></div>
                        </div>
                        <div 
                          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 h-4 w-2 bg-${employee.color}-500 rounded-b-sm`}
                          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
                        ></div>
                      </div>
                      
                      {/* Historical positions */}
                      {showHistorical && employee.positions.slice(0, -1).map((pos, index) => (
                        <div 
                          key={`hist-${employee.id}-${index}`}
                          className={`absolute w-3 h-3 bg-${employee.color}-200 rounded-full`}
                          style={{ 
                            left: `calc(${pos.left} - ${currentPosition.left})`, 
                            top: `calc(${pos.top} - ${currentPosition.top})`,
                            opacity: 0.7
                          }}
                        >
                          <div className={`w-1.5 h-1.5 bg-${employee.color}-400 rounded-full m-auto translate-y-[30%]`}></div>
                        </div>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-sm">
                      <p className="font-semibold">{employee.name}</p>
                      <p>{employee.location}</p>
                      <p className="text-gray-500">Last seen: {employee.lastSeen}</p>
                      <p className="text-gray-500 text-xs">At: {currentPosition.timestamp}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
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
