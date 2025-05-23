
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmployeeDocumentsTabProps {
  onDownload: (documentType: string, documentUrl?: string) => void;
  onEditDocument: (type: 'aadhar' | 'pan') => void;
  employeeId?: string; // Changed from number to string
  documentPaths?: {
    aadhar?: string;
    pan?: string;
    profile?: string;
  };
}

const EmployeeDocumentsTab: React.FC<EmployeeDocumentsTabProps> = ({ 
  onDownload, 
  onEditDocument,
  employeeId,
  documentPaths
}) => {
  const { toast } = useToast();

  const handleDownload = async (documentType: string, documentUrl?: string) => {
    if (!documentUrl) {
      toast({
        title: "No Document",
        description: `No ${documentType} document available for download`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract file name from the public URL
      const fileName = documentUrl.split('/').pop();
      if (!fileName) {
        throw new Error("Invalid file path");
      }
      
      // Get the folder path
      const folderPath = documentType.toLowerCase() === 'aadhar card' 
        ? `${employeeId}/aadhar/`
        : documentType.toLowerCase() === 'pan card'
          ? `${employeeId}/pan/`
          : '';
      
      // Download the file
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .download(`${folderPath}${fileName}`);
        
      if (error) {
        throw error;
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentType.replace(' ', '_')}_${employeeId}.${fileName.split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Document Downloaded",
        description: `The ${documentType} has been downloaded to your device`,
      });
    } catch (error) {
      console.error(`Error downloading ${documentType}:`, error);
      
      // Call the original onDownload function as fallback
      onDownload(documentType, documentUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Aadhar Card</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('Aadhar Card', documentPaths?.aadhar)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditDocument('aadhar')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </div>
        <div>
          <Label>PAN Card</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('Pan Card', documentPaths?.pan)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditDocument('pan')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </div>
      </div>
      {documentPaths?.profile && (
        <div className="mt-4">
          <img 
            src={documentPaths.profile} 
            alt="Profile Photo" 
            className="h-32 w-32 rounded-full object-cover border-2 border-gray-200" 
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeDocumentsTab;
