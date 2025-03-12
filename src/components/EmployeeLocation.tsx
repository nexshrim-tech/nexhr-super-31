
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const EmployeeLocation = () => {
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
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeLocation;
