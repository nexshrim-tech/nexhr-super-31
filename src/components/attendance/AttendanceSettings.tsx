
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Save, Download, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface AttendanceSettings {
  workStartTime: string;
  lateThreshold: string;
  enableGeofencing: boolean;
  defaultRadius: number;
  requirePhoto: boolean;
  holidays: Date[];
  locations: Location[];
}

interface AttendanceSettingsProps {
  onSave: (settings: AttendanceSettings) => void;
}

const AttendanceSettings = ({ onSave }: AttendanceSettingsProps) => {
  const [settings, setSettings] = React.useState<AttendanceSettings>({
    workStartTime: "09:00",
    lateThreshold: "09:30",
    enableGeofencing: true,
    defaultRadius: 250,
    requirePhoto: true,
    holidays: [],
    locations: [],
  });

  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = React.useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  const handleHolidaySelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSettings(prev => ({ ...prev, holidays: [] }));
      return;
    }
    setSettings(prev => ({ ...prev, holidays: dates }));
  };

  const handleExport = () => {
    if (dateRange?.from && dateRange?.to) {
      console.log(`Exporting attendance data from ${format(dateRange.from, 'PP')} to ${format(dateRange.to, 'PP')}`);
      setIsExportDialogOpen(false);
    }
  };

  React.useEffect(() => {
    if (!mapContainer.current || !isLocationDialogOpen) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler for adding locations
    map.current.on('click', (e) => {
      const newLocation: Location = {
        id: Date.now().toString(),
        name: `Location ${settings.locations.length + 1}`,
        coordinates: [e.lngLat.lng, e.lngLat.lat]
      };

      // Add marker
      new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);

      // Add circle for radius
      map.current?.addSource(`circle-${newLocation.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [e.lngLat.lng, e.lngLat.lat]
          },
          properties: {}
        }
      });

      map.current?.addLayer({
        id: `circle-${newLocation.id}`,
        type: 'circle',
        source: `circle-${newLocation.id}`,
        paint: {
          'circle-radius': settings.defaultRadius,
          'circle-color': '#4353ff',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#4353ff'
        }
      });

      setSettings(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }));
    });

    return () => map.current?.remove();
  }, [isLocationDialogOpen]);

  const handleSaveSettings = () => {
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Work Start Time</Label>
              <Input
                type="time"
                value={settings.workStartTime}
                onChange={(e) => setSettings({ ...settings, workStartTime: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Employees arriving before this time are marked as present
              </p>
            </div>
            <div className="space-y-2">
              <Label>Late Threshold</Label>
              <Input
                type="time"
                value={settings.lateThreshold}
                onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Employees arriving after this time are marked as late
              </p>
            </div>
          </div>

          {/* Geofencing Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Geofencing</Label>
              <div className="text-sm text-muted-foreground">
                Require employees to be within office radius
              </div>
            </div>
            <Switch
              checked={settings.enableGeofencing}
              onCheckedChange={(checked) => setSettings({ ...settings, enableGeofencing: checked })}
            />
          </div>

          {/* Photo Requirement */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Photo Requirement</Label>
              <div className="text-sm text-muted-foreground">
                Require photo capture during attendance
              </div>
            </div>
            <Switch
              checked={settings.requirePhoto}
              onCheckedChange={(checked) => setSettings({ ...settings, requirePhoto: checked })}
            />
          </div>

          {/* Location Management */}
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setIsLocationDialogOpen(true)}>
              <MapPin className="h-4 w-4 mr-2" />
              Manage Locations
            </Button>
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Manage Office Locations</DialogTitle>
                </DialogHeader>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <div ref={mapContainer} className="h-full" />
                </div>
                <div className="mt-4">
                  <Label>Added Locations</Label>
                  <div className="grid gap-2 mt-2">
                    {settings.locations.map((location) => (
                      <div key={location.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{location.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {location.coordinates[1].toFixed(6)}, {location.coordinates[0].toFixed(6)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Holiday Management */}
          <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
            <Button variant="outline" onClick={() => setIsHolidayDialogOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Manage Holidays
            </Button>
            <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Manage Holidays</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    <CalendarComponent
                      mode="multiple"
                      selected={settings.holidays}
                      onSelect={handleHolidaySelect}
                      className="rounded-md border pointer-events-auto"
                    />
                    <div className="space-y-2">
                      <Label>Selected Holidays</Label>
                      <div className="flex flex-wrap gap-2">
                        {settings.holidays.map((date) => (
                          <Badge 
                            key={date.toISOString()} 
                            variant="secondary"
                          >
                            {format(date, 'PPP')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>

          {/* Export Dialog */}
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export Attendance Data
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Attendance Records</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label>Select Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport}>
                  Export
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSettings;
