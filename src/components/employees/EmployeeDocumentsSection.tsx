
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface EmployeeDocumentsSectionProps {
  leaves: string;
  onDownload: (documentType: string) => void;
  onViewDetails: (type: string) => void;
}

const EmployeeDocumentsSection: React.FC<EmployeeDocumentsSectionProps> = ({ 
  leaves, 
  onDownload, 
  onViewDetails 
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Attendance Report:</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => onDownload('Attendance Report')}
          >
            <Download className="h-4 w-4" />
            Download Excel Report
          </Button>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Aadhar Card:</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => onDownload('Aadhar Card')}
          >
            <Download className="h-4 w-4" />
            Download Aadhar
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Pan Card:</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => onDownload('Pan Card')}
          >
            <Download className="h-4 w-4" />
            Download pan card
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Leaves this month:</h3>
          <Badge variant="outline" className="px-3 py-1">
            {leaves}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Salary details:</h3>
          <Button variant="default" size="sm" onClick={() => onViewDetails('Salary')}>
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentsSection;
