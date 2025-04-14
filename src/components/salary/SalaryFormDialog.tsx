
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
import { SalaryFormDialogProps } from "@/types/components";

const SalaryFormDialog: React.FC<SalaryFormDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSave,
  employeeList
}) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSave = (formData: any) => {
    if (onSave) onSave(formData);
  };

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
          onClose={handleClose}
          employeeName="New Employee"
          initialSalary={50000}
          onSave={handleSave}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="salary-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryFormDialog;
