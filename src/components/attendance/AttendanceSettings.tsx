
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, MapPin, Camera, AlarmClock, Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";

// Import refactored components
import TimeSettings from './settings/TimeSettings';
import FeatureToggle from './settings/FeatureToggle';
import HolidayManager from './settings/HolidayManager';
import ExportManager from './settings/ExportManager';
import LocationManager from './settings/LocationManager';
import { Separator } from '@/components/ui/separator';

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
  const [settings, setSettings] = useState<AttendanceSettings>({
    workStartTime: "09:00",
    lateThreshold: "09:30",
    enableGeofencing: true,
    defaultRadius: 250,
    requirePhoto: true,
    holidays: [],
    locations: [],
  });

  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const handleHolidaySelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSettings(prev => ({ ...prev, holidays: [] }));
      return;
    }
    setSettings(prev => ({ ...prev, holidays: dates }));
  };

  const handleExport = () => {
    if (dateRange?.from && dateRange?.to) {
      console.log(`Exporting attendance data from ${dateRange.from} to ${dateRange.to}`);
      setIsExportDialogOpen(false);
    }
  };

  const handleSaveSettings = () => {
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      {/* Time Configuration */}
      <TimeSettings
        workStartTime={settings.workStartTime}
        lateThreshold={settings.lateThreshold}
        onWorkStartTimeChange={(value) => setSettings({ ...settings, workStartTime: value })}
        onLateThresholdChange={(value) => setSettings({ ...settings, lateThreshold: value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feature Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geofencing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeatureToggle
              title="Enable Geofencing"
              description="Require employees to be within office radius"
              enabled={settings.enableGeofencing}
              onToggle={(checked) => setSettings({ ...settings, enableGeofencing: checked })}
            />
            
            <Separator className="my-2" />
            
            <LocationManager
              locations={settings.locations}
              onLocationsChange={(locations) => setSettings({ ...settings, locations })}
              isDialogOpen={isLocationDialogOpen}
              setIsDialogOpen={setIsLocationDialogOpen}
              geofencingEnabled={settings.enableGeofencing}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureToggle
              title="Require Photo"
              description="Require photo capture during attendance"
              enabled={settings.requirePhoto}
              onToggle={(checked) => setSettings({ ...settings, requirePhoto: checked })}
            />
          </CardContent>
        </Card>
      </div>

      {/* Holiday Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Holiday Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HolidayManager
            holidays={settings.holidays}
            isDialogOpen={isHolidayDialogOpen}
            setIsDialogOpen={setIsHolidayDialogOpen}
            onHolidaysChange={handleHolidaySelect}
          />
        </CardContent>
      </Card>

      {/* Export Manager */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlarmClock className="h-4 w-4" />
            Reports & Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExportManager
            isDialogOpen={isExportDialogOpen}
            setIsDialogOpen={setIsExportDialogOpen}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExport={handleExport}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
};

export default AttendanceSettings;
