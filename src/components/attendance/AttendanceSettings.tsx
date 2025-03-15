
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import LocationPicker from './LocationPicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceSettingsProps {
  onSave: (settings: any) => void;
}

const AttendanceSettings = ({ onSave }: AttendanceSettingsProps) => {
  const [settings, setSettings] = React.useState({
    workStartTime: "09:00",
    lateThreshold: "09:30",
    enableGeofencing: true,
    defaultRadius: 250,
    requirePhoto: true
  });

  return (
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

        <Button onClick={() => onSave(settings)}>Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceSettings;
