
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePhotoUploadProps {
  onPhotoUpload: (photoUrl: string) => void;
  currentPhoto?: string;
  employeeName?: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onPhotoUpload,
  currentPhoto,
  employeeName = "Employee"
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload to employee-documents bucket under profiles folder
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(`profiles/${fileName}`, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(`profiles/${fileName}`);

      onPhotoUpload(publicUrl);

      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentPhoto} alt={employeeName} />
        <AvatarFallback className="text-lg">
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById('profile-photo-input')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
        <input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
