
import React from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  avatar: string;
}

interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: () => void;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSave,
}) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Make changes to employee information</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{employee.avatar}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={employee.name} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={employee.email} />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input defaultValue={employee.role} />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select defaultValue={employee.department.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue={employee.status.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
