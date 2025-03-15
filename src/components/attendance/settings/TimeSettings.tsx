
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSettingsProps {
  workStartTime: string;
  lateThreshold: string;
  onWorkStartTimeChange: (value: string) => void;
  onLateThresholdChange: (value: string) => void;
}

const TimeSettings = ({ 
  workStartTime, 
  lateThreshold, 
  onWorkStartTimeChange, 
  onLateThresholdChange 
}: TimeSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Work Start Time</Label>
        <Input
          type="time"
          value={workStartTime}
          onChange={(e) => onWorkStartTimeChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Employees arriving before this time are marked as present
        </p>
      </div>
      <div className="space-y-2">
        <Label>Late Threshold</Label>
        <Input
          type="time"
          value={lateThreshold}
          onChange={(e) => onLateThresholdChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Employees arriving after this time are marked as late
        </p>
      </div>
    </div>
  );
};

export default TimeSettings;
