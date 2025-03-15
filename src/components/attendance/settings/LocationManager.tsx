
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LocationSettings from "@/components/attendance/LocationSettings";

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface LocationManagerProps {
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  geofencingEnabled: boolean;
}

const LocationManager = ({ 
  locations, 
  onLocationsChange, 
  isDialogOpen, 
  setIsDialogOpen,
  geofencingEnabled
}: LocationManagerProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Office Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {geofencingEnabled 
              ? "Manage office locations where employees must be present to mark attendance" 
              : "Geo-fencing is disabled. Enable it to restrict attendance by location"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
            disabled={!geofencingEnabled}
            className="w-full"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Manage Locations
            {locations.length > 0 && ` (${locations.length})`}
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Office Locations</DialogTitle>
            </DialogHeader>
            <LocationSettings 
              locations={locations} 
              onLocationsChange={onLocationsChange} 
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LocationManager;
