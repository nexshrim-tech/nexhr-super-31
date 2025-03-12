
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Map, Maximize, Minimize, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationMapProps {
  employeeId?: number;
  defaultView?: boolean;
}

const LocationMap = ({ employeeId, defaultView = true }: LocationMapProps) => {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  const handleViewFullMap = () => {
    setIsFullscreen(true);
    toast({
      title: "Full map view activated",
      description: "You can now see all employee locations in detail."
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
          <Button 
            className="absolute top-4 right-4 z-10" 
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
          >
            <Minimize className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        )}
        
        <img 
          src="/lovable-uploads/5f84f812-bedb-480e-ac18-b71a9a3e45e8.png" 
          alt="Map with employee locations" 
          className="w-full h-full object-cover"
        />
        
        {employeeId && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-md flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Tracking Employee ID: {employeeId}</span>
          </div>
        )}
        
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
        
        {/* Map markers would go here in a real implementation */}
        <div className="absolute left-[25%] top-[45%]">
          <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute left-[45%] top-[30%]">
          <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute left-[65%] top-[50%]">
          <div className="w-5 h-5 bg-yellow-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute left-[55%] top-[65%]">
          <div className="w-5 h-5 bg-purple-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 bg-purple-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
