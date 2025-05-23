import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/SidebarNav";
import { addEmployee } from "@/services/employeeService";
import { Employee } from "@/types/employee";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: undefined,
    jobtitle: "",
    department: "",
    employmentstatus: "Active",
    employmenttype: "",
    gender: "",
    dateofbirth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalcode: "",
    monthlysalary: 0,
    bloodgroup: "",
    fathersname: "",
    maritalstatus: "",
    disabilitystatus: "",
    nationality: "",
    worklocation: "",
    leavebalance: 0,
    employeepassword: "",
    customerid: "" // Initialize as required field
  });

  const handleInputChange = (field: keyof Employee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstname || !formData.lastname || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (First Name, Last Name, Email)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Convert phonenumber from string to number if it's a string
      const employeeData: Omit<Employee, 'employeeid'> = {
        ...formData,
        customerid: formData.customerid || 'default-customer', // Ensure customerid is provided
        phonenumber: typeof formData.phonenumber === 'string' && formData.phonenumber 
          ? parseInt(formData.phonenumber.replace(/\D/g, '')) 
          : formData.phonenumber,
        monthlysalary: typeof formData.monthlysalary === 'string' 
          ? parseFloat(formData.monthlysalary) 
          : formData.monthlysalary,
        leavebalance: typeof formData.leavebalance === 'string' 
          ? parseInt(formData.leavebalance) 
          : formData.leavebalance,
      };

      await addEmployee(employeeData);
      
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
      
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      type="text"
                      value={formData.firstname || ""}
                      onChange={(e) => handleInputChange("firstname", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Last Name *</Label>
                    <Input
                      id="lastname"
                      type="text"
                      value={formData.lastname || ""}
                      onChange={(e) => handleInputChange("lastname", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phonenumber">Phone Number</Label>
                    <Input
                      id="phonenumber"
                      type="tel"
                      value={formData.phonenumber?.toString() || ""}
                      onChange={(e) => handleInputChange("phonenumber", e.target.value)}
                    />
                  </div>
                </div>

                {/* Job Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobtitle">Job Title</Label>
                    <Input
                      id="jobtitle"
                      type="text"
                      value={formData.jobtitle || ""}
                      onChange={(e) => handleInputChange("jobtitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      value={formData.department || ""}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentstatus">Employment Status</Label>
                    <Select value={formData.employmentstatus} onValueChange={(value) => handleInputChange("employmentstatus", value)}>
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="monthlysalary">Monthly Salary</Label>
                    <Input
                      id="monthlysalary"
                      type="number"
                      value={formData.monthlysalary?.toString() || ""}
                      onChange={(e) => handleInputChange("monthlysalary", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateofbirth">Date of Birth</Label>
                    <Input
                      id="dateofbirth"
                      type="date"
                      value={formData.dateofbirth || ""}
                      onChange={(e) => handleInputChange("dateofbirth", e.target.value)}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.state || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      value={formData.country || ""}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalcode">Postal Code</Label>
                    <Input
                      id="postalcode"
                      type="text"
                      value={formData.postalcode || ""}
                      onChange={(e) => handleInputChange("postalcode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Employee"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/employees")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
