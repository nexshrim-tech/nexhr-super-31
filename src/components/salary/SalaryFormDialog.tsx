
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SalaryDetailsForm from "@/components/SalaryDetailsForm";

interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSave: (formData: any) => void;
}

const SalaryFormDialog: React.FC<SalaryFormDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Salary Details</DialogTitle>
          <DialogDescription>
            Enter the salary details for the employee. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <SalaryDetailsForm 
          isOpen={open}
          onClose={onClose}
          employeeName="New Employee"
          initialSalary={50000}
          onSave={onSave}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="salary-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryFormDialog;
