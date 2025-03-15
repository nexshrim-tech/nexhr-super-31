
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeatureToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  id?: string;
}

const FeatureToggle = ({ title, description, enabled, onToggle, id }: FeatureToggleProps) => {
  return (
    <div className="flex items-center justify-between space-y-0 rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id ?? title}>{title}</Label>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
      <Switch
        id={id ?? title}
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default FeatureToggle;
