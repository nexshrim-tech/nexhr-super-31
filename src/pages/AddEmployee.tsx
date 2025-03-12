
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    jobTitle: "",
    employeeId: "",
    joinDate: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formProgress, setFormProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Calculate form progress
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(val => val.trim() !== "").length;
    setFormProgress(Math.floor((filledFields / totalFields) * 100));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send the data to a server
      toast({
        title: "Employee information saved",
        description: "The employee has been successfully added to the system.",
      });
      
      // Redirect to employees list after successful submission
      setTimeout(() => {
        navigate("/all-employees");
      }, 2000);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Add New Employee</h1>
              <p className="text-gray-500">Add a new employee to your organization</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={avatarPreview || ""} alt="Profile" />
                      <AvatarFallback>Upload</AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600"
                      >
                        <Upload className="h-4 w-4" />
                        Upload photo
                      </Label>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-medium">Employee Information</h3>
                      <p className="text-sm text-gray-500">
                        Fill in all the required details to add a new employee
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800">Saving Progress</h4>
                      <div className="mt-2">
                        <div className="h-2 bg-blue-100 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${formProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-600">
                        {formProgress}% complete
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="employment">Employment</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                      <TabsTrigger value="bank">Bank Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className={formErrors.firstName ? "text-red-500" : ""}>First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Enter first name" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={formErrors.firstName ? "border-red-500" : ""}
                          />
                          {formErrors.firstName && (
                            <p className="text-xs text-red-500">{formErrors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className={formErrors.lastName ? "text-red-500" : ""}>Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Enter last name" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={formErrors.lastName ? "border-red-500" : ""}
                          />
                          {formErrors.lastName && (
                            <p className="text-xs text-red-500">{formErrors.lastName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "gender")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input id="nationality" placeholder="Enter nationality" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="marital-status">Marital Status</Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "maritalStatus")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={() => setActiveTab("employment")}>Next</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="employment" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input 
                            id="employeeId" 
                            placeholder="Enter employee ID" 
                            value={formData.employeeId}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input 
                            id="jobTitle" 
                            placeholder="Enter job title" 
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "department")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joinDate">Join Date</Label>
                          <Input 
                            id="joinDate" 
                            type="date" 
                            value={formData.joinDate}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employment-type">Employment Type</Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "employmentType")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="work-location">Work Location</Label>
                          <Input id="work-location" placeholder="Enter work location" onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setActiveTab("personal")}>Previous</Button>
                        <Button onClick={() => setActiveTab("contact")}>Next</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className={formErrors.email ? "text-red-500" : ""}>Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter email address" 
                            value={formData.email}
                            onChange={handleInputChange}
                            className={formErrors.email ? "border-red-500" : ""}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-red-500">{formErrors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="Enter phone number" 
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" placeholder="Enter address" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Enter city" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input id="state" placeholder="Enter state or province" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip/Postal Code</Label>
                          <Input id="zip" placeholder="Enter zip or postal code" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" placeholder="Enter country" onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setActiveTab("employment")}>Previous</Button>
                        <Button onClick={() => setActiveTab("bank")}>Next</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input id="bank-name" placeholder="Enter bank name" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="Enter account number" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routing-number">Routing Number</Label>
                          <Input id="routing-number" placeholder="Enter routing number" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-type">Account Type</Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "accountType")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setActiveTab("contact")}>Previous</Button>
                        <Button onClick={handleSubmit}>Save Employee</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
