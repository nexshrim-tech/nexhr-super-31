
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LocationMapProps {
  employeeId?: number;
  defaultView?: boolean;
}

const LocationMap = ({ employeeId, defaultView = true }: LocationMapProps) => {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleViewFullMap = () => {
    setIsFullscreen(true);
    toast({
      title: "Full map view activated",
      description: "You can now see all employee locations in detail."
    });
  };

  return (
    <div className={`bg-white p-4 border rounded-md ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full min-h-[600px]'} relative`}>
      {isFullscreen && (
        <Button 
          className="absolute top-4 right-4 z-10" 
          onClick={() => setIsFullscreen(false)}
        >
          Close Fullscreen
        </Button>
      )}
      
      <img 
        src="/lovable-uploads/5f84f812-bedb-480e-ac18-b71a9a3e45e8.png" 
        alt="Map with employee locations" 
        className="w-full h-full object-cover rounded-md"
      />
      
      {employeeId && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          <span className="text-sm font-medium">Tracking Employee ID: {employeeId}</span>
        </div>
      )}
      
      {defaultView && (
        <div className="absolute bottom-4 right-4">
          <Button variant="outline" className="bg-white" onClick={handleViewFullMap}>
            <Map className="h-4 w-4 mr-2" />
            View full map
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
