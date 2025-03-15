
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

  const handleHolidaySelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSettings(prev => ({ ...prev, holidays: [] }));
      return;
    }
    setSettings(prev => ({ ...prev, holidays: dates }));
  };

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
