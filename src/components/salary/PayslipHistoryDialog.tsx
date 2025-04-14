
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { PayslipRecord } from "@/types/salary";
import PayslipHistory from "./PayslipHistory";

interface PayslipHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslips: PayslipRecord[];
  onViewPayslip: (id: string) => void;
}

const PayslipHistoryDialog: React.FC<PayslipHistoryDialogProps> = ({
  open,
  onOpenChange,
  payslips,
  onViewPayslip
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payslip History</DialogTitle>
        </DialogHeader>
        <PayslipHistory 
          payslips={payslips}
          onViewPayslip={onViewPayslip}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PayslipHistoryDialog;
