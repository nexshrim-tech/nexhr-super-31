
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Camera, Calendar, Users, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AttendanceSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: any) => void;
}

const AttendanceSettingsDialog = ({ isOpen, onOpenChange, onSave }: AttendanceSettingsDialogProps) => {
  const [settings, setSettings] = useState({
    workStartTime: "09:00",
    workEndTime: "17:00",
    lateThreshold: "09:15",
    breakDuration: "60",
    enableGeofencing: true,
    geofenceRadius: "100",
    requirePhoto: true,
    allowSelfCheckout: true,
    enableNotifications: true,
    autoMarkAbsent: false,
    weekendWork: false,
    flexibleHours: false,
  });

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attendance Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workStartTime">Work Start Time</Label>
                      <Input
                        id="workStartTime"
                        type="time"
                        value={settings.workStartTime}
                        onChange={(e) => updateSetting('workStartTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workEndTime">Work End Time</Label>
                      <Input
                        id="workEndTime"
                        type="time"
                        value={settings.workEndTime}
                        onChange={(e) => updateSetting('workEndTime', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lateThreshold">Late Threshold</Label>
                      <Input
                        id="lateThreshold"
                        type="time"
                        value={settings.lateThreshold}
                        onChange={(e) => updateSetting('lateThreshold', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                      <Input
                        id="breakDuration"
                        type="number"
                        value={settings.breakDuration}
                        onChange={(e) => updateSetting('breakDuration', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="flexibleHours">Flexible Hours</Label>
                        <p className="text-sm text-gray-600">Allow employees to work flexible hours</p>
                      </div>
                      <Switch
                        id="flexibleHours"
                        checked={settings.flexibleHours}
                        onCheckedChange={(checked) => updateSetting('flexibleHours', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekendWork">Weekend Work</Label>
                        <p className="text-sm text-gray-600">Allow attendance marking on weekends</p>
                      </div>
                      <Switch
                        id="weekendWork"
                        checked={settings.weekendWork}
                        onCheckedChange={(checked) => updateSetting('weekendWork', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Location Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableGeofencing">Enable Geofencing</Label>
                      <p className="text-sm text-gray-600">Restrict attendance to office location</p>
                    </div>
                    <Switch
                      id="enableGeofencing"
                      checked={settings.enableGeofencing}
                      onCheckedChange={(checked) => updateSetting('enableGeofencing', checked)}
                    />
                  </div>
                  
                  {settings.enableGeofencing && (
                    <div>
                      <Label htmlFor="geofenceRadius">Geofence Radius (meters)</Label>
                      <Input
                        id="geofenceRadius"
                        type="number"
                        value={settings.geofenceRadius}
                        onChange={(e) => updateSetting('geofenceRadius', e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5" />
                    Security & Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requirePhoto">Require Photo Verification</Label>
                      <p className="text-sm text-gray-600">Require selfie for attendance</p>
                    </div>
                    <Switch
                      id="requirePhoto"
                      checked={settings.requirePhoto}
                      onCheckedChange={(checked) => updateSetting('requirePhoto', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowSelfCheckout">Allow Self Checkout</Label>
                      <p className="text-sm text-gray-600">Let employees check out themselves</p>
                    </div>
                    <Switch
                      id="allowSelfCheckout"
                      checked={settings.allowSelfCheckout}
                      onCheckedChange={(checked) => updateSetting('allowSelfCheckout', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Notifications & Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableNotifications">Enable Notifications</Label>
                      <p className="text-sm text-gray-600">Send attendance reminders and alerts</p>
                    </div>
                    <Switch
                      id="enableNotifications"
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoMarkAbsent">Auto Mark Absent</Label>
                      <p className="text-sm text-gray-600">Automatically mark as absent if no check-in</p>
                    </div>
                    <Switch
                      id="autoMarkAbsent"
                      checked={settings.autoMarkAbsent}
                      onCheckedChange={(checked) => updateSetting('autoMarkAbsent', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceSettingsDialog;
