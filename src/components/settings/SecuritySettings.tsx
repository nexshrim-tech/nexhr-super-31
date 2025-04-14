
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    setPasswordError('');
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      
      toast({
        title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
        description: twoFactorEnabled 
          ? "Two-factor authentication has been disabled."
          : "Two-factor authentication has been enabled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating two-factor authentication.",
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
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long and include numbers and special characters.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button 
            onClick={handlePasswordChange} 
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication (2FA)</Label>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={toggleTwoFactor}
              disabled={isLoading}
              aria-label="Toggle two-factor authentication"
            />
          </div>
          
          <Separator />
          
          {twoFactorEnabled && (
            <div className="space-y-2">
              <h3 className="font-medium">Recovery Codes</h3>
              <p className="text-sm text-muted-foreground">
                Keep these recovery codes in a safe place. You can use them to sign in if you lose access to your authentication app.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["1A2B-3C4D-5E6F", "7G8H-9I0J-1K2L", "3M4N-5O6P-7Q8R", "9S0T-1U2V-3W4X", "5Y6Z-7A8B-9C0D", "1E2F-3G4H-5I6J"].map((code, index) => (
                  <div key={index} className="bg-accent p-2 rounded text-sm font-mono">
                    {code}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-2">Download Recovery Codes</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Sessions</CardTitle>
          <CardDescription>
            Manage active sessions on your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start border p-4 rounded-md">
              <div>
                <h3 className="font-medium">Current Session</h3>
                <p className="text-sm text-muted-foreground">Windows - Chrome - IP: 192.168.1.1</p>
                <p className="text-xs text-muted-foreground">Last active: Just now</p>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Current</span>
            </div>
            
            <div className="flex justify-between items-start border p-4 rounded-md">
              <div>
                <h3 className="font-medium">Mobile Session</h3>
                <p className="text-sm text-muted-foreground">iOS - Safari - IP: 203.0.113.1</p>
                <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">Revoke</Button>
            </div>
            
            <div className="flex justify-between items-start border p-4 rounded-md">
              <div>
                <h3 className="font-medium">Tablet Session</h3>
                <p className="text-sm text-muted-foreground">Android - Chrome - IP: 198.51.100.1</p>
                <p className="text-xs text-muted-foreground">Last active: Yesterday</p>
              </div>
              <Button variant="outline" size="sm">Revoke</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="destructive">Revoke All Other Sessions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecuritySettings;
