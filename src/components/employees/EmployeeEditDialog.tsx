
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee, updateEmployee, addEmployee } from "@/services/employeeService";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";

interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (updatedEmployee?: Employee) => void;
  isNewEmployee?: boolean;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSave,
  isNewEmployee = false,
}) => {
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { customerId } = useSubscription();

  useEffect(() => {
    if (employee) {
      const sanitizedEmployee = { ...employee };
      if (sanitizedEmployee.joiningdate === '') sanitizedEmployee.joiningdate = null;
      if (sanitizedEmployee.dateofbirth === '') sanitizedEmployee.dateofbirth = null;
      if (sanitizedEmployee.terminationdate === '') sanitizedEmployee.terminationdate = null;
      
      setEmployeeData(sanitizedEmployee);
    } else if (isNewEmployee) {
      setEmployeeData({
        firstname: '',
        lastname: '',
        email: '',
        jobtitle: '',
        employmentstatus: 'Active',
        customerid: customerId,
      });
    }
  }, [employee, isNewEmployee, customerId]);

  const handleChange = (field: keyof Employee, value: string | number) => {
    if (
      (field === 'joiningdate' || field === 'dateofbirth' || 
       field === 'terminationdate') && 
      value === ''
    ) {
      setEmployeeData(prev => ({ ...prev, [field]: null }));
    } else {
      setEmployeeData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!employeeData.firstname || !employeeData.lastname || !employeeData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields (First Name, Last Name, Email).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting employee data:", employeeData);
      
      let result: Employee;
      
      if (isNewEmployee) {
        const newEmployeeData = {
          ...employeeData,
          customerid: customerId || 1,
        };
        
        result = await addEmployee(newEmployeeData as Omit<Employee, 'employeeid'>);
        toast({
          title: "Success",
          description: "Employee created successfully",
        });
      } else if (employee?.employeeid) {
        result = await updateEmployee(employee.employeeid, employeeData);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        throw new Error("Invalid operation: Cannot update without employee ID");
      }
      
      onSave(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Error",
        description: `Failed to save employee: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isNewEmployee ? "Add New Employee" : "Edit Employee Information"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstname" className="text-right">
              First Name*
            </Label>
            <Input
              id="firstname"
              value={employeeData.firstname || ''}
              onChange={(e) => handleChange('firstname', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastname" className="text-right">
              Last Name*
            </Label>
            <Input
              id="lastname"
              value={employeeData.lastname || ''}
              onChange={(e) => handleChange('lastname', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              value={employeeData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobtitle" className="text-right">
              Job Title
            </Label>
            <Input
              id="jobtitle"
              value={employeeData.jobtitle || ''}
              onChange={(e) => handleChange('jobtitle', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phonenumber" className="text-right">
              Phone
            </Label>
            <Input
              id="phonenumber"
              value={employeeData.phonenumber || ''}
              onChange={(e) => handleChange('phonenumber', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={employeeData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select 
              value={employeeData.gender || ''}
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joiningdate" className="text-right">
              Joining Date
            </Label>
            <Input
              id="joiningdate"
              type="date"
              value={employeeData.joiningdate || ''}
              onChange={(e) => handleChange('joiningdate', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateofbirth" className="text-right">
              Date of Birth
            </Label>
            <Input
              id="dateofbirth"
              type="date"
              value={employeeData.dateofbirth || ''}
              onChange={(e) => handleChange('dateofbirth', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
