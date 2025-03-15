
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  
  React.useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = () => {
    toast({
      title: "Feature coming soon",
      description: "Changing profile photo will be available in a future update.",
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.department || !formData.role) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSave();
    toast({
      title: "Employee updated",
      description: "Employee information has been updated successfully.",
    });
  };

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
              <AvatarFallback>{formData.avatar || employee.avatar}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handlePhotoChange}>Change Photo</Button>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                name="name"
                value={formData.name || employee.name} 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                name="email"
                value={formData.email || employee.email} 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Input 
                name="role"
                value={formData.role || employee.role} 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={(formData.department || employee.department).toLowerCase()}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
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
              <Select 
                value={(formData.status || employee.status).toLowerCase()}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
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
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
