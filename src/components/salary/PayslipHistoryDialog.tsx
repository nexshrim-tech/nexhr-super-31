
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { PayslipHistoryDialogProps } from "@/types/components";
import PayslipHistory from "./PayslipHistory";

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
