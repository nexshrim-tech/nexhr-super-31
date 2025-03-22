import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

// Define types for the form data
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  fatherName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  employeeId: string;
  joinDate: string;
  password: string;
  confirmPassword: string;
  bloodGroup: string;
  hasDisability: boolean;
  gender: string;
  maritalStatus: string;
  nationality: string;
  employmentType: string;
  workLocation: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
}

interface EmployeeFormProps {
  formData: EmployeeFormData;
  formErrors: Record<string, string>;
  departmentOptions: {id: number, name: string}[];
  isSubmitting: boolean;
  avatarPreview: string | null;
  documents: {
    aadharCard: File | null;
    panCard: File | null;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: 'aadharCard' | 'panCard') => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  formData,
  formErrors,
  departmentOptions,
  isSubmitting,
  avatarPreview,
  documents,
  activeTab,
  setActiveTab,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  handleImageUpload,
  handleDocumentUpload,
  handleSubmit
}) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-600">
      <div className="bg-gradient-to-r from-gray-50 to-white p-5">
        <h2 className="text-gray-800 font-medium text-xl">Employee Details</h2>
      </div>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-gradient-to-r from-gray-100 to-gray-50">
            <TabsTrigger value="personal" className="data-[state=active]:bg-nexhr-primary data-[state=active]:text-white">Personal</TabsTrigger>
            <TabsTrigger value="employment" className="data-[state=active]:bg-nexhr-primary data-[state=active]:text-white">Employment</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-nexhr-primary data-[state=active]:text-white">Contact</TabsTrigger>
            <TabsTrigger value="bank" className="data-[state=active]:bg-nexhr-primary data-[state=active]:text-white">Bank Details</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-nexhr-primary data-[state=active]:text-white">Documents</TabsTrigger>
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
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input 
                  id="fatherName" 
                  placeholder="Enter father's name" 
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
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
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(value) => handleSelectChange(value, "bloodGroup")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
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
              <div className="space-y-2 pt-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasDisability" 
                    checked={formData.hasDisability}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="hasDisability" className="font-medium text-gray-700">
                    Person with disability
                  </Label>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  This information is kept confidential and will only be used for inclusive workplace accommodations.
                </p>
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
                    {departmentOptions.length > 0 ? (
                      departmentOptions.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </>
                    )}
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
                <Label htmlFor="workLocation">Work Location</Label>
                <Input 
                  id="workLocation" 
                  placeholder="Enter work location" 
                  value={formData.workLocation}
                  onChange={handleInputChange}
                />
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
                <Label htmlFor="password" className={formErrors.password ? "text-red-500" : ""}>Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Set password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={formErrors.confirmPassword ? "text-red-500" : ""}>
                  Confirm Password
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={formErrors.confirmPassword ? "border-red-500" : ""}
                />
                {formErrors.confirmPassword && (
                  <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
                )}
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
                <Label htmlFor="zipCode">Zip/Postal Code</Label>
                <Input id="zipCode" placeholder="Enter zip or postal code" onChange={handleInputChange} />
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
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="Enter bank name" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input id="branchName" placeholder="Enter branch name" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Enter account number" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input id="ifscCode" placeholder="Enter IFSC code" onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
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
              <Button onClick={() => setActiveTab("documents")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Aadhar Card</h4>
                        <p className="text-sm text-gray-500">Upload employee's Aadhar card</p>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="aadhar-upload"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, 'aadharCard')}
                        />
                        <Label
                          htmlFor="aadhar-upload"
                          className="cursor-pointer inline-flex items-center gap-2 border px-3 py-2 rounded-md text-sm"
                        >
                          <FileText className="h-4 w-4" />
                          {documents.aadharCard ? 'Change File' : 'Upload File'}
                        </Label>
                      </div>
                    </div>
                    {documents.aadharCard && (
                      <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                        File uploaded: {documents.aadharCard.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">PAN Card</h4>
                        <p className="text-sm text-gray-500">Upload employee's PAN card</p>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="pan-upload"
                          className="sr-only"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, 'panCard')}
                        />
                        <Label
                          htmlFor="pan-upload"
                          className="cursor-pointer inline-flex items-center gap-2 border px-3 py-2 rounded-md text-sm"
                        >
                          <FileText className="h-4 w-4" />
                          {documents.panCard ? 'Change File' : 'Upload File'}
                        </Label>
                      </div>
                    </div>
                    {documents.panCard && (
                      <div className="p-3 bg-green-50 text-green-800 rounded-md text-sm">
                        File uploaded: {documents.panCard.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("bank")}>Previous</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Employee"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
