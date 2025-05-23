
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfileSettings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone_number || '',
    company: user?.user_metadata?.company_name || '',
    position: user?.user_metadata?.role || profile?.role || '',
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile || user) {
      setFormData({
        fullName: profile?.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone_number || '',
        company: user?.user_metadata?.company_name || '',
        position: profile?.role || user?.user_metadata?.role || '',
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (profile?.id) {
        // Update the profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: formData.fullName,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
          
        if (error) throw error;
        
        // Refresh the profile data
        await refreshProfile();
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error updating your profile.",
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
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a new avatar. JPG, GIF or PNG. Max 1MB.
              </p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <Separator />
          
          {/* User Role Information */}
          {profile && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Role:</div>
                <div className="font-medium capitalize">{profile.role}</div>
                
                {profile.customer_id && (
                  <>
                    <div className="text-muted-foreground">Organization ID:</div>
                    <div className="font-medium">{profile.customer_id}</div>
                  </>
                )}
                
                {profile.employee_id && (
                  <>
                    <div className="text-muted-foreground">Employee ID:</div>
                    <div className="font-medium">{profile.employee_id}</div>
                  </>
                )}
                
                <div className="text-muted-foreground">Account Created:</div>
                <div className="font-medium">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company"
                readOnly={profile?.role === 'employee'}
                disabled={profile?.role === 'employee'}
              />
              {profile?.role === 'employee' && (
                <p className="text-xs text-muted-foreground">
                  Company information can only be changed by administrators.
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter your position"
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Your role in the system is managed by administrators.
              </p>
            </div>
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

export default ProfileSettings;
