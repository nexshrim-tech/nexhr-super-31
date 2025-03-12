
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const EmployeeLocation = () => {
  const [isLive, setIsLive] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleLiveTracking = () => {
    setIsLive(!isLive);
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[250px] bg-gray-100 relative overflow-hidden">
          <img 
            src="/lovable-uploads/016a0f11-68a9-490e-8ef9-08b4721cb325.png" 
            alt="Employee Location Map" 
            className="absolute w-full h-full object-cover"
          />
          
          {/* Map markers */}
          <div className="absolute left-[25%] top-[45%]">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="absolute left-[45%] top-[30%]">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="absolute left-[65%] top-[50%]">
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="absolute left-[35%] top-[65%]">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
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
