
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUpdateDialogProps {
  type: 'aadhar' | 'pan' | null;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (type: 'aadhar' | 'pan', filePath: string) => void;
  employeeId?: string; // Changed from number to string
}

const DocumentUpdateDialog: React.FC<DocumentUpdateDialogProps> = ({
  type,
  isOpen,
  onClose,
  onUpload,
  employeeId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!type || !file || !employeeId) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}/${type}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload file to the employee-documents bucket
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(fileName, file);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(fileName);
        
      // Call the onUpload function with the file path
      onUpload(type, publicUrl);
      
      toast({
        title: "Document Uploaded",
        description: `Your ${type === 'aadhar' ? 'Aadhar' : 'PAN'} card has been uploaded successfully`,
      });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload the document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  if (!type) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {type === 'aadhar' ? 'Aadhar' : 'PAN'} Card</DialogTitle>
          <DialogDescription>
            Upload a new document to update the existing one
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileChange}
            disabled={uploading}
          />
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpdateDialog;
