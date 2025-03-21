
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = (bucketName: string = 'documents') => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File, path?: string): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Create the full path
      const fileExt = file.name.split('.').pop();
      const filePath = path 
        ? `${path}/${Date.now()}.${fileExt}`
        : `${Date.now()}.${fileExt}`;
      
      // Upload the file without progress monitoring since it's not supported
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Set progress to complete as we can't monitor it
      setProgress(100);
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      setIsUploading(false);
      
      toast({
        title: 'File uploaded',
        description: 'File has been successfully uploaded',
      });
      
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsUploading(false);
      return null;
    }
  };
  
  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'File deleted',
        description: 'File has been successfully deleted',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Deletion failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { uploadFile, deleteFile, isUploading, progress };
};
