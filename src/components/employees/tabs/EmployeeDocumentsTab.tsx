
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface EmployeeDocumentsTabProps {
  onDownload: (documentType: string) => void;
  onEditDocument: (type: 'aadhar' | 'pan') => void;
}

const EmployeeDocumentsTab: React.FC<EmployeeDocumentsTabProps> = ({ 
  onDownload, 
  onEditDocument 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Aadhar Card</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload('Aadhar Card')}
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
              onClick={() => onDownload('Pan Card')}
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
    </div>
  );
};

export default EmployeeDocumentsTab;
