
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
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
}

const LocationManager = ({ 
  locations, 
  onLocationsChange, 
  isDialogOpen, 
  setIsDialogOpen 
}: LocationManagerProps) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <MapPin className="h-4 w-4 mr-2" />
          Manage Locations
        </Button>
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
    </>
  );
};

export default LocationManager;
