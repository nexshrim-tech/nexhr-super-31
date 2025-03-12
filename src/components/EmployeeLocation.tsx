
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeLocation = () => {
  const [isLive, setIsLive] = useState(false);
  
  const toggleLiveTracking = () => {
    setIsLive(!isLive);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">Employee Location</CardTitle>
            <p className="text-xs text-muted-foreground">Mon, 6 January</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] bg-gray-100 rounded-lg relative overflow-hidden">
          <img 
            src="/lovable-uploads/016a0f11-68a9-490e-8ef9-08b4721cb325.png" 
            alt="Employee Location Map" 
            className="absolute w-full h-full object-cover"
          />
          
          {isLive && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <span className="animate-pulse mr-1 inline-block h-2 w-2 rounded-full bg-white"></span>
              Live
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white shadow-sm"
              onClick={toggleLiveTracking}
            >
              {isLive ? "Pause Tracking" : "Start Live Tracking"}
            </Button>
            
            <Link to="/track">
              <Button size="sm" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                View All Locations
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeLocation;
