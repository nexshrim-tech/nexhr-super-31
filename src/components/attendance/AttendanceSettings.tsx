import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DayPickerMultipleSelect } from "react-day-picker";

interface AttendanceSettingsProps {
  onSave: (settings: any) => void;
}

const AttendanceSettings = ({ onSave }: AttendanceSettingsProps) => {
  const [settings, setSettings] = React.useState({
    workStartTime: "09:00",
    lateThreshold: "09:30",
    enableGeofencing: true,
    defaultRadius: 250,
    requirePhoto: true,
  });

  const [holidays, setHolidays] = React.useState<Date[]>([]);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = React.useState(false);

  const handleHolidaySelect: DayPickerMultipleSelect = (dates) => {
    if (!dates) {
      setHolidays([]);
      return;
    }
    setHolidays(dates);
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
            </div>
            <div className="space-y-2">
              <Label>Late Threshold</Label>
              <Input
                type="time"
                value={settings.lateThreshold}
                onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })}
              />
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
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Holidays
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Holidays</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <CalendarComponent
                  mode="multiple"
                  selected={holidays}
                  onSelect={handleHolidaySelect}
                  className="rounded-md border pointer-events-auto"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  Click on dates to toggle them as holidays. Selected dates are marked as holidays.
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => onSave({ ...settings, holidays })}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSettings;
