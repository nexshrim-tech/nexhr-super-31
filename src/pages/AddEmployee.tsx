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
import { ChevronLeft, Upload, FileText, ArrowLeftCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import { Checkbox } from "@/components/ui/checkbox";
import { addEmployee } from "@/services/employeeService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types/employee";

// Define the form schema based on the Employee type
// Making required fields required in the schema
const employeeFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phonenumber: z.string().optional(),
  jobtitle: z.string().default(""),
  department: z.string().default(""),
  joiningdate: z.string().nullable().default(null),
  profilepicturepath: z.string().default(""),
  address: z.string().default(""),
  gender: z.string().default(""),
  dateofbirth: z.string().nullable().default(null),
  city: z.string().default(""),
  state: z.string().default(""),
  country: z.string().default(""),
  postalcode: z.string().default(""),
  monthlysalary: z.number().default(0),
  employmentstatus: z.enum(["Active", "Inactive", "On Leave", "Terminated", "Probation"]).default("Active"),
  employmenttype: z.string().default(""),
  bloodgroup: z.string().default(""),
  fathersname: z.string().default(""),
  maritalstatus: z.string().default(""),
  disabilitystatus: z.string().default("No"),
  nationality: z.string().default(""),
  worklocation: z.string().default(""),
  leavebalance: z.number().default(0),
  employeepassword: z.string().default("")
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const { features, customerId } = useSubscription();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState({
    aadharCard: null as File | null,
    panCard: null as File | null
  });

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      jobtitle: "",
      department: "",
      joiningdate: null,
      profilepicturepath: "",
      address: "",
      gender: "",
      dateofbirth: null,
      city: "",
      state: "",
      country: "",
      postalcode: "",
      monthlysalary: 0,
      employmentstatus: "Active",
      employmenttype: "",
      bloodgroup: "",
      fathersname: "",
      maritalstatus: "",
      disabilitystatus: "No",
      nationality: "",
      worklocation: "",
      leavebalance: 0,
      employeepassword: ""
    }
  });

  // Calculate form progress based on filled fields
  React.useEffect(() => {
    const watchedValues = form.watch();
    const totalFields = Object.keys(watchedValues).length;
    const filledFields = Object.values(watchedValues).filter(val => 
      typeof val === "string" ? val.trim() !== "" : val !== undefined && val !== null
    ).length;
    setFormProgress(Math.floor((filledFields / totalFields) * 100));
  }, [form.watch()]);

  // Check if feature is available
  if (!features.employeeManagement) {
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
            
            <FeatureLock 
              title="Employee Management Feature"
              description="Subscribe to a plan to unlock the ability to add and manage employees in your organization."
            />
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        form.setValue('profilepicturepath', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: 'aadharCard' | 'panCard') => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
      
      toast({
        title: "Document uploaded",
        description: `${docType === 'aadharCard' ? 'Aadhar Card' : 'PAN Card'} successfully uploaded.`
      });
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Preparing to add employee with data:", data);
      
      // Ensure all required fields are provided as non-optional
      const employeeData: Omit<Employee, "employeeid"> = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        customerid: customerId || "",
        phonenumber: data.phonenumber || "",
        jobtitle: data.jobtitle || "",
        department: data.department || "",
        joiningdate: data.joiningdate || null,
        profilepicturepath: data.profilepicturepath || "",
        address: data.address || "",
        gender: data.gender || "",
        dateofbirth: data.dateofbirth || null,
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        postalcode: data.postalcode || "",
        monthlysalary: data.monthlysalary,
        employmentstatus: data.employmentstatus,
        employmenttype: data.employmenttype || "",
        bloodgroup: data.bloodgroup || "",
        fathersname: data.fathersname || "",
        maritalstatus: data.maritalstatus || "",
        disabilitystatus: data.disabilitystatus || "",
        nationality: data.nationality || "",
        worklocation: data.worklocation || "",
        leavebalance: data.leavebalance,
        employeepassword: data.employeepassword || ""
      };
      
      console.log("Submitting employee data to database:", employeeData);
      
      const result = await addEmployee(employeeData);
      console.log("Employee added successfully:", result);
      
      toast({
        title: "Employee added successfully",
        description: "The employee has been successfully added to the system.",
      });
      
      setTimeout(() => {
        navigate("/all-employees");
      }, 500);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Error adding employee",
        description: "There was a problem adding the employee to the database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">Add New Employee</h1>
              <p className="text-gray-500">Add a new employee to your organization</p>
            </div>
            <Link to="/all-employees">
              <Button variant="outline" className="flex items-center gap-2 border-nexhr-primary text-nexhr-primary hover:bg-nexhr-primary/10">
                <ArrowLeftCircle className="h-4 w-4" />
                Back to Employee List
              </Button>
            </Link>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card className="border-t-4 border-t-nexhr-primary shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-1 rounded-full bg-gradient-to-r from-nexhr-primary to-purple-600">
                          <Avatar className="h-32 w-32 border-4 border-white">
                            <AvatarImage src={avatarPreview || ""} alt="Profile" />
                            <AvatarFallback className="bg-gradient-to-r from-gray-200 to-gray-300">Upload</AvatarFallback>
                          </Avatar>
                        </div>
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
                            className="cursor-pointer inline-flex items-center gap-2 text-sm text-nexhr-primary hover:text-purple-600 transition-colors"
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
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <h4 className="font-medium text-blue-800">Saving Progress</h4>
                          <div className="mt-2">
                            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                              <div 
                                className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" 
                                style={{ width: `${formProgress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-medium text-blue-600">
                            {formProgress}% complete
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-600">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                      <CardTitle className="text-gray-800">Employee Details</CardTitle>
                    </CardHeader>
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
                            <FormField
                              control={form.control}
                              name="firstname"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter first name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastname"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter last name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="fathersname"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Father's Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter father's name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dateofbirth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date of Birth</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Female">Female</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bloodgroup"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Blood Group</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="A+">A+</SelectItem>
                                      <SelectItem value="A-">A-</SelectItem>
                                      <SelectItem value="B+">B+</SelectItem>
                                      <SelectItem value="B-">B-</SelectItem>
                                      <SelectItem value="AB+">AB+</SelectItem>
                                      <SelectItem value="AB-">AB-</SelectItem>
                                      <SelectItem value="O+">O+</SelectItem>
                                      <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="nationality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nationality</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter nationality" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="maritalstatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Marital Status</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select marital status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Single">Single</SelectItem>
                                      <SelectItem value="Married">Married</SelectItem>
                                      <SelectItem value="Divorced">Divorced</SelectItem>
                                      <SelectItem value="Widowed">Widowed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="disabilitystatus"
                              render={({ field }) => (
                                <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0 pt-2">
                                  <FormControl>
                                    <Checkbox 
                                      checked={field.value === "Yes"} 
                                      onCheckedChange={(checked) => field.onChange(checked ? "Yes" : "No")}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Person with disability</FormLabel>
                                    <p className="text-xs text-gray-500">
                                      This information is kept confidential and will only be used for inclusive workplace accommodations.
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button">Cancel</Button>
                            <Button type="button" onClick={() => setActiveTab("employment")}>Next</Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="employment" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="jobtitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter job title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Engineering">Engineering</SelectItem>
                                      <SelectItem value="Design">Design</SelectItem>
                                      <SelectItem value="Marketing">Marketing</SelectItem>
                                      <SelectItem value="HR">HR</SelectItem>
                                      <SelectItem value="Finance">Finance</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="joiningdate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Join Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="employmenttype"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Full-time">Full-time</SelectItem>
                                      <SelectItem value="Part-time">Part-time</SelectItem>
                                      <SelectItem value="Contract">Contract</SelectItem>
                                      <SelectItem value="Intern">Intern</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="worklocation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Work Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter work location" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="employmentstatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Status</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Active">Active</SelectItem>
                                      <SelectItem value="Inactive">Inactive</SelectItem>
                                      <SelectItem value="On Leave">On Leave</SelectItem>
                                      <SelectItem value="Terminated">Terminated</SelectItem>
                                      <SelectItem value="Probation">Probation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="monthlysalary"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Monthly Salary</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Enter monthly salary" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="leavebalance"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Leave Balance</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="Enter leave balance" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("personal")}>Previous</Button>
                            <Button type="button" onClick={() => setActiveTab("contact")}>Next</Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address*</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phonenumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="Enter phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="employeepassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Set password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm Password</Label>
                              <Input 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirm password"
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State/Province</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter state or province" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="postalcode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Zip/Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter zip or postal code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter country" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("employment")}>Previous</Button>
                            <Button type="button" onClick={() => setActiveTab("bank")}>Next</Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="bank" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="bank-name">Bank Name</Label>
                              <Input id="bank-name" placeholder="Enter bank name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="branch-name">Branch Name</Label>
                              <Input id="branch-name" placeholder="Enter branch name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="account-number">Account Number</Label>
                              <Input id="account-number" placeholder="Enter account number" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ifsc-code">IFSC Code</Label>
                              <Input id="ifsc-code" placeholder="Enter IFSC code" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="account-type">Account Type</Label>
                              <Select>
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
                            <Button variant="outline" type="button" onClick={() => setActiveTab("contact")}>Previous</Button>
                            <Button type="button" onClick={() => setActiveTab("documents")}>Next</Button>
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
                            <Button variant="outline" type="button" onClick={() => setActiveTab("bank")}>Previous</Button>
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Saving..." : "Save Employee"}
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
