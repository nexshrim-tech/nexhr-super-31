
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeatureToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  size?: "default" | "small";
}

const FeatureToggle = ({ 
  title, 
  description, 
  enabled, 
  onToggle, 
  id,
  disabled = false,
  size = "default"
}: FeatureToggleProps) => {
  return (
    <div className={`flex items-center justify-between ${size === "default" ? "space-y-0 rounded-lg border p-4" : "gap-2"}`}>
      <div className={size === "default" ? "space-y-0.5" : ""}>
        <Label htmlFor={id ?? title} className={size === "small" ? "text-sm" : ""}>{title}</Label>
        {description && (
          <div className="text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      <Switch
        id={id ?? title}
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
        className={size === "small" ? "scale-75" : ""}
      />
    </div>
  );
};

export default FeatureToggle;
