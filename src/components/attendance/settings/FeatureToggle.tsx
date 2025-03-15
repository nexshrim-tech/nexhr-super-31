
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeatureToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
}

const FeatureToggle = ({ title, description, enabled, onToggle }: FeatureToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default FeatureToggle;
