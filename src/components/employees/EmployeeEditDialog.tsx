
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  avatar: string;
  firstname?: string;
  lastname?: string;
  jobtitle?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  joinDate?: string;
  employeeid?: number;
}

interface EmployeeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = () => {
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword()) {
      toast({
        title: "Password validation error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Employee password has been updated successfully",
    });
    
    // Reset password fields
    setPassword("");
    setConfirmPassword("");
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
    
    onSave(formData as Employee);
    toast({
      title: "Employee updated",
      description: "Employee information has been updated successfully.",
    });
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Employee Profile</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback>{formData.avatar || employee.avatar}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handlePhotoChange}>Change Photo</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name || employee.name} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input 
                  id="fatherName"
                  name="fatherName"
                  placeholder="Enter father's name"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ""}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="employment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId"
                  name="employeeId"
                  value={formData.id || employee.id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input 
                  id="role"
                  name="role"
                  value={formData.role || employee.role} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={(formData.department || employee.department).toLowerCase()}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department">
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={(formData.status || employee.status).toLowerCase()}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  value={formData.email || employee.email} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone || ""} 
                  placeholder="Enter phone number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  placeholder="Enter address"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Change Password
              </h3>
              <p className="text-sm text-blue-600 mb-4">
                Update the employee's account password. The employee will need to use this new password for their next login.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (confirmPassword) validatePassword();
                      }}
                      iconRight={
                        <button 
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label 
                    htmlFor="confirm-password"
                    className={passwordError ? "text-red-500" : ""}
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (password) validatePassword();
                    }}
                    className={passwordError ? "border-red-500 focus:ring-red-500" : ""}
                    iconRight={
                      <button 
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                  {passwordError && (
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {passwordError}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handlePasswordChange}
                  className="mt-2"
                  variant="outline"
                  size="sm"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
