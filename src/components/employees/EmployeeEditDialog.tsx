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
      // Create a deep copy of the employee object to prevent issues with state management
      const sanitizedEmployee = JSON.parse(JSON.stringify(employee));
      
      // Ensure special date fields are properly formatted
      if (sanitizedEmployee.joiningdate === '') sanitizedEmployee.joiningdate = null;
      if (sanitizedEmployee.dateofbirth === '') sanitizedEmployee.dateofbirth = null;
      
      setEmployeeData(sanitizedEmployee);
      console.log('Initialized employee data:', sanitizedEmployee);
    } else if (isNewEmployee) {
      setEmployeeData({
        firstname: '',
        lastname: '',
        email: '',
        jobtitle: '',
        employmentstatus: 'Active',
        customerid: customerId,
        department: '',
        gender: '',
        phonenumber: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalcode: '',
        monthlysalary: 0,
        employmenttype: '',
        bloodgroup: '',
        fathersname: '',
        maritalstatus: '',
        disabilitystatus: '',
        nationality: '',
        worklocation: '',
        leavebalance: 0,
        employeepassword: '',
        documentpath: '',
        profilepicturepath: ''
      });
    }
  }, [employee, isNewEmployee, customerId]);

  const handleChange = (field: keyof Employee, value: string | number) => {
    if (
      (field === 'joiningdate' || field === 'dateofbirth') && 
      value === ''
    ) {
      setEmployeeData(prev => ({ ...prev, [field]: null }));
    } else {
      setEmployeeData(prev => ({ ...prev, [field]: value }));
    }
    console.log(`Changed field ${field} to:`, value);
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
        // Ensure all fields have appropriate default values for new employees
        const newEmployeeData = {
          ...employeeData,
          customerid: customerId || 1,
          fathersname: employeeData.fathersname || '',
          nationality: employeeData.nationality || '',
          maritalstatus: employeeData.maritalstatus || '',
          worklocation: employeeData.worklocation || '',
          employmenttype: employeeData.employmenttype || '',
          bloodgroup: employeeData.bloodgroup || '',
          disabilitystatus: employeeData.disabilitystatus || '',
          employeepassword: employeeData.employeepassword || '',
          documentpath: employeeData.documentpath || '',
          leavebalance: employeeData.leavebalance || 0,
          profilepicturepath: employeeData.profilepicturepath || '',
          monthlysalary: employeeData.monthlysalary || 0
        };
        
        console.log("Creating new employee with complete data:", newEmployeeData);
        result = await addEmployee(newEmployeeData as Omit<Employee, 'employeeid'>);
        toast({
          title: "Success",
          description: "Employee created successfully",
        });
      } else if (employee?.employeeid) {
        console.log("Updating existing employee with ID:", employee.employeeid);
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
        description: `Failed to save employee: ${(error as Error).message}`,
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
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
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
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={employeeData.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nationality" className="text-right">
              Nationality
            </Label>
            <Input
              id="nationality"
              value={employeeData.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="worklocation" className="text-right">
              Work Location
            </Label>
            <Input
              id="worklocation"
              value={employeeData.worklocation || ''}
              onChange={(e) => handleChange('worklocation', e.target.value)}
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
            <Label htmlFor="monthlysalary" className="text-right">
              Monthly Salary
            </Label>
            <Input
              id="monthlysalary"
              type="number"
              value={employeeData.monthlysalary || 0}
              onChange={(e) => handleChange('monthlysalary', e.target.value ? parseFloat(e.target.value) : 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leavebalance" className="text-right">
              Leave Balance
            </Label>
            <Input
              id="leavebalance"
              type="number"
              value={employeeData.leavebalance || 0}
              onChange={(e) => handleChange('leavebalance', e.target.value ? parseFloat(e.target.value) : 0)}
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
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input
              id="city"
              value={employeeData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              State
            </Label>
            <Input
              id="state"
              value={employeeData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={employeeData.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postalcode" className="text-right">
              Postal Code
            </Label>
            <Input
              id="postalcode"
              value={employeeData.postalcode || ''}
              onChange={(e) => handleChange('postalcode', e.target.value)}
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
            <Label htmlFor="bloodgroup" className="text-right">
              Blood Group
            </Label>
            <Input
              id="bloodgroup"
              value={employeeData.bloodgroup || ''}
              onChange={(e) => handleChange('bloodgroup', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fathersname" className="text-right">
              Father's Name
            </Label>
            <Input
              id="fathersname"
              value={employeeData.fathersname || ''}
              onChange={(e) => handleChange('fathersname', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maritalstatus" className="text-right">
              Marital Status
            </Label>
            <Select 
              value={employeeData.maritalstatus || ''}
              onValueChange={(value) => handleChange('maritalstatus', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="disabilitystatus" className="text-right">
              Disability Status
            </Label>
            <Input
              id="disabilitystatus"
              value={employeeData.disabilitystatus || ''}
              onChange={(e) => handleChange('disabilitystatus', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employmentstatus" className="text-right">
              Employment Status
            </Label>
            <Select 
              value={employeeData.employmentstatus || 'Active'}
              onValueChange={(value: 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation') => 
                handleChange('employmentstatus', value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employmenttype" className="text-right">
              Employment Type
            </Label>
            <Select 
              value={employeeData.employmenttype || ''}
              onValueChange={(value) => handleChange('employmenttype', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profilepicturepath" className="text-right">
              Profile Picture URL
            </Label>
            <Input
              id="profilepicturepath"
              value={employeeData.profilepicturepath || ''}
              onChange={(e) => handleChange('profilepicturepath', e.target.value)}
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
