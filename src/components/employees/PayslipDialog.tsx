
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { PayslipRecord } from "@/types/salary";

interface PayslipDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: PayslipRecord[];
}

const PayslipDialog: React.FC<PayslipDialogProps> = ({
  isOpen,
  onOpenChange,
  payslips
}) => {
  const handleDownload = (id: string) => {
    // Placeholder for download functionality
    console.log(`Downloading payslip ${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Recent Payslips</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {payslips.map((payslip) => (
              <div 
                key={payslip.id} 
                className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{payslip.period}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(payslip.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">₹{payslip.amount.toLocaleString()}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownload(payslip.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipDialog;
