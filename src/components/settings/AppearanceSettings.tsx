
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [themeSettings, setThemeSettings] = useState({
    theme: 'system',
    colorScheme: 'blue',
    fontSize: 'medium',
    animation: true,
    reduceMotion: false,
    highContrast: false
  });

  const handleThemeChange = (key: string, value: string | boolean) => {
    setThemeSettings({
      ...themeSettings,
      [key]: value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your appearance settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">Theme Mode</Label>
            <RadioGroup
              value={themeSettings.theme}
              onValueChange={(value) => handleThemeChange('theme', value)}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              <div>
                <RadioGroupItem
                  value="light"
                  id="theme-light"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="h-6 w-6 mb-2" />
                  <span className="text-center font-normal">Light</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="dark"
                  id="theme-dark"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="h-6 w-6 mb-2" />
                  <span className="text-center font-normal">Dark</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="system"
                  id="theme-system"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex h-6 w-6 items-center justify-center mb-2">
                    <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                  <span className="text-center font-normal">System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Select 
              value={themeSettings.colorScheme} 
              onValueChange={(value) => handleThemeChange('colorScheme', value)}
            >
              <SelectTrigger id="colorScheme">
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue (Default)</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="teal">Teal</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select 
              value={themeSettings.fontSize} 
              onValueChange={(value) => handleThemeChange('fontSize', value)}
            >
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium (Default)</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Configure accessibility preferences for better usability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Animations</Label>
              <p className="text-sm text-muted-foreground">
                Show animations throughout the interface
              </p>
            </div>
            <Switch
              checked={themeSettings.animation}
              onCheckedChange={(checked) => handleThemeChange('animation', checked)}
              aria-label="Toggle animations"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and movements
              </p>
            </div>
            <Switch
              checked={themeSettings.reduceMotion}
              onCheckedChange={(checked) => handleThemeChange('reduceMotion', checked)}
              aria-label="Toggle reduce motion"
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Enhance visual distinction between elements
              </p>
            </div>
            <Switch
              checked={themeSettings.highContrast}
              onCheckedChange={(checked) => handleThemeChange('highContrast', checked)}
              aria-label="Toggle high contrast"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
