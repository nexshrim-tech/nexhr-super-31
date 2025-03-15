
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Search, Upload, Download, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Sample employee data for auto-filling
const employees = [
  { 
    id: "EMP001", 
    name: "Olivia Rhye", 
    email: "olivia.rhye@example.com",
    role: "UI Designer",
    department: "Design",
    joiningDate: "2022-01-10",
    reportingManager: "Phoenix Baker",
    employeeId: "EMP-1001",
    avatar: "OR"
  },
  { 
    id: "EMP002", 
    name: "Phoenix Baker", 
    email: "phoenix.baker@example.com",
    role: "Product Manager",
    department: "Product",
    joiningDate: "2021-05-15",
    reportingManager: "Lana Steiner",
    employeeId: "EMP-1002",
    avatar: "PB"
  },
  { 
    id: "EMP003", 
    name: "Lana Steiner", 
    email: "lana.steiner@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    joiningDate: "2021-09-22",
    reportingManager: "Candice Wu",
    employeeId: "EMP-1003",
    avatar: "LS"
  },
  { 
    id: "EMP004", 
    name: "Demi Wilkinson", 
    email: "demi.wilkinson@example.com",
    role: "Backend Developer",
    department: "Engineering",
    joiningDate: "2022-02-01",
    reportingManager: "Candice Wu",
    employeeId: "EMP-1004",
    avatar: "DW"
  },
  { 
    id: "EMP005", 
    name: "Candice Wu", 
    email: "candice.wu@example.com",
    role: "Engineering Lead",
    department: "Engineering",
    joiningDate: "2020-11-15",
    reportingManager: "CEO",
    employeeId: "EMP-1005",
    avatar: "CW"
  },
];

// Document categories and templates
const documentCategories = [
  {
    id: "employee-management",
    name: "Employee Management",
    templates: [
      { id: "offer-letter", name: "Offer Letter" },
      { id: "appointment-letter", name: "Appointment Letter" },
      { id: "joining-letter", name: "Joining Letter" },
      { id: "employee-contract", name: "Employee Agreement/Contract" },
      { id: "nda", name: "Non-Disclosure Agreement (NDA)" },
      { id: "employee-handbook", name: "Employee Handbook" },
      { id: "code-of-conduct", name: "Code of Conduct Policy" },
    ]
  },
  {
    id: "payroll",
    name: "Payroll & Compensation",
    templates: [
      { id: "salary-structure", name: "Salary Structure Template" },
      { id: "payslip", name: "Payslip Template" },
      { id: "salary-revision", name: "Salary Revision Letter" },
      { id: "bonus-letter", name: "Bonus and Incentive Letter" },
      { id: "tax-declaration", name: "Tax Declaration Form" },
    ]
  },
  {
    id: "attendance-leave",
    name: "Attendance & Leave Management",
    templates: [
      { id: "leave-request", name: "Leave Request Form" },
      { id: "leave-approval", name: "Leave Approval/Rejection Letter" },
      { id: "timesheet", name: "Timesheet Template" },
      { id: "wfh-request", name: "Work From Home Request Form" },
    ]
  },
  {
    id: "performance",
    name: "Performance & Appraisal",
    templates: [
      { id: "performance-review", name: "Performance Review Form" },
      { id: "appraisal-letter", name: "Appraisal Letter" },
      { id: "promotion-letter", name: "Promotion Letter" },
      { id: "warning-letter", name: "Warning Letter for Poor Performance" },
    ]
  },
  {
    id: "exit",
    name: "Exit & Termination",
    templates: [
      { id: "resignation-letter", name: "Resignation Letter Template" },
      { id: "exit-interview", name: "Exit Interview Form" },
      { id: "experience-letter", name: "Experience Letter" },
      { id: "settlement-letter", name: "Full & Final Settlement Letter" },
      { id: "termination-letter", name: "Termination Letter" },
    ]
  },
  {
    id: "compliance",
    name: "Compliance & Legal",
    templates: [
      { id: "pf-esi-forms", name: "PF & ESI Declaration Forms" },
      { id: "gratuity-form", name: "Gratuity Nomination Form" },
      { id: "company-policies", name: "Company Policies" },
      { id: "confidentiality-agreement", name: "Confidentiality Agreement" },
    ]
  },
  {
    id: "other",
    name: "Other HR Templates",
    templates: [
      { id: "id-card", name: "Employee ID Card Template" },
      { id: "internship-certificate", name: "Internship Certificate Template" },
      { id: "training-certificate", name: "Training Completion Certificate" },
      { id: "referral-form", name: "Employee Referral Form" },
    ]
  }
];

const DocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [letterhead, setLetterhead] = useState<File | null>(null);
  const [letterheadPreview, setLetterheadPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // State for template editing
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templateContent, setTemplateContent] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");
  
  // New state for employee selection
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLetterhead(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setLetterheadPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Letterhead uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
  };

  const removeLetterhead = () => {
    setLetterhead(null);
    setLetterheadPreview(null);
    toast({
      title: "Letterhead removed",
      description: "Letterhead has been removed successfully."
    });
  };

  const handleTemplateSelect = (category: string, template: any) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    
    // Default template content with employee placeholders
    setTemplateContent(`Dear [Employee Name],

This is a sample template for the ${template.name}.

[Your content here]

Sincerely,
[Manager Name]
[Company Name]`);
    
    setTemplateVariables(["Employee Name", "Manager Name", "Company Name"]);
    
    // Reset employee selection
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    // Replace template variables with employee data
    let updatedContent = templateContent;
    updatedContent = updatedContent.replace(/\[Employee Name\]/g, employee.name);
    updatedContent = updatedContent.replace(/\[Employee ID\]/g, employee.employeeId);
    updatedContent = updatedContent.replace(/\[Employee Email\]/g, employee.email);
    updatedContent = updatedContent.replace(/\[Employee Role\]/g, employee.role);
    updatedContent = updatedContent.replace(/\[Employee Department\]/g, employee.department);
    updatedContent = updatedContent.replace(/\[Joining Date\]/g, employee.joiningDate);
    updatedContent = updatedContent.replace(/\[Manager Name\]/g, employee.reportingManager);
    
    setTemplateContent(updatedContent);
    
    toast({
      title: "Employee selected",
      description: `Template updated with ${employee.name}'s information.`
    });
  };

  const handleAddVariable = () => {
    if (newVariable && !templateVariables.includes(newVariable)) {
      setTemplateVariables([...templateVariables, newVariable]);
      setNewVariable("");
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setTemplateVariables(templateVariables.filter(v => v !== variable));
  };

  const handleGenerateDocument = () => {
    // This would actually generate the document
    toast({
      title: "Document generated",
      description: `${templateName} has been generated successfully.`
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template saved",
      description: `${templateName} has been saved successfully.`
    });
    setSelectedTemplate(null);
    setTemplateContent("");
    setTemplateName("");
    setTemplateVariables([]);
  };

  // Filter templates based on search and category
  const filteredTemplates = // ... keep existing code (template filtering logic)

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-semibold">Document Generator</h1>
            <p className="text-gray-500">Create, customize and generate HR documents</p>
          </div>
          
          <div className="p-4 lg:p-8 flex-1">
            <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <TabsList className="mb-0">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="generated">Generated Documents</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                {activeTab === "templates" && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search templates..."
                        className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {documentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <TabsContent value="templates" className="m-0">
                {selectedTemplate ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <div className="flex items-center justify-between">
                              <span>Edit Template</span>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                                <X className="h-4 w-4 mr-1" />
                                Close
                              </Button>
                            </div>
                          </CardTitle>
                          <CardDescription>
                            Customize the template content and variables
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="template-name">Template Name</Label>
                              <Input 
                                id="template-name" 
                                value={templateName} 
                                onChange={(e) => setTemplateName(e.target.value)}
                              />
                            </div>
                            
                            {/* New Employee Selection */}
                            <div>
                              <Label htmlFor="employee-select">Auto-fill with Employee Data</Label>
                              <Select 
                                value={selectedEmployee || ''} 
                                onValueChange={handleEmployeeSelect}
                              >
                                <SelectTrigger id="employee-select" className="w-full">
                                  <SelectValue placeholder="Select employee to auto-fill" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                                        </Avatar>
                                        <span>{employee.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500 mt-1">
                                Select an employee to auto-fill the template with their information
                              </p>
                            </div>
                            
                            <div>
                              <Label htmlFor="template-content">Content</Label>
                              <Textarea 
                                id="template-content" 
                                className="min-h-[300px] font-mono"
                                value={templateContent} 
                                onChange={(e) => setTemplateContent(e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={handleSaveTemplate}>
                              Save Template
                            </Button>
                            <Button onClick={handleGenerateDocument}>
                              Generate Document
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Template Variables</CardTitle>
                          <CardDescription>
                            Add or remove variables for this template
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Input 
                                placeholder="New variable name"
                                value={newVariable}
                                onChange={(e) => setNewVariable(e.target.value)}
                              />
                              <Button 
                                variant="outline" 
                                onClick={handleAddVariable}
                                disabled={!newVariable}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                              {templateVariables.map((variable) => (
                                <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                                  {variable}
                                  <button 
                                    className="ml-1 h-3.5 w-3.5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                                    onClick={() => handleRemoveVariable(variable)}
                                  >
                                    <X className="h-2 w-2" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="border rounded-md p-3 bg-gray-50">
                              <p className="text-sm text-muted-foreground mb-2">
                                Common employee variables you can use:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline">[Employee Name]</Badge>
                                <Badge variant="outline">[Employee ID]</Badge>
                                <Badge variant="outline">[Employee Email]</Badge>
                                <Badge variant="outline">[Employee Role]</Badge>
                                <Badge variant="outline">[Employee Department]</Badge>
                                <Badge variant="outline">[Joining Date]</Badge>
                                <Badge variant="outline">[Manager Name]</Badge>
                              </div>
                            </div>
                            
                            <div className="border rounded-md p-3 bg-gray-50">
                              <p className="text-sm text-muted-foreground mb-2">
                                How to use variables in your template:
                              </p>
                              <p className="text-sm">
                                Use the format <code className="bg-gray-100 px-1 rounded">[Variable Name]</code> in your template content.
                              </p>
                              <p className="text-sm mt-1">
                                Example: <code className="bg-gray-100 px-1 rounded">Dear [Employee Name],</code>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {letterheadPreview && (
                        <Card className="mt-4">
                          <CardHeader>
                            <CardTitle>Letterhead Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="border rounded-md overflow-hidden">
                              <img 
                                src={letterheadPreview} 
                                alt="Letterhead preview" 
                                className="w-full object-contain max-h-[200px]"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="space-y-6">
                      {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((category: any) => (
                          <div key={category.id} className="space-y-3">
                            <h3 className="text-lg font-medium">{category.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.templates.map((template: any) => (
                                <Card 
                                  key={template.id} 
                                  className="hover:border-blue-200 cursor-pointer transition-all hover:shadow-md"
                                  onClick={() => handleTemplateSelect(category.id, template)}
                                >
                                  <CardContent className="pt-6">
                                    <div className="flex items-start space-x-4">
                                      <div className="bg-blue-50 p-2 rounded-md">
                                        <FileText className="h-6 w-6 text-blue-500" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{template.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                          Click to customize and generate
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No templates found</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="generated" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Documents</CardTitle>
                    <CardDescription>
                      View and download your generated documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No documents generated yet</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Your generated documents will appear here
                      </p>
                      <Button className="mt-4" onClick={() => setActiveTab("templates")}>
                        Go to Templates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Settings</CardTitle>
                    <CardDescription>
                      Configure your document generation preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Letterhead</h3>
                        <div className="border rounded-md p-4">
                          {letterhead ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <p className="font-medium">{letterhead.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {(letterhead.size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={removeLetterhead}>
                                  <X className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                              
                              {letterheadPreview && (
                                <div className="border rounded-md overflow-hidden">
                                  <img 
                                    src={letterheadPreview} 
                                    alt="Letterhead preview" 
                                    className="w-full object-contain max-h-[200px]"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-center border-2 border-dashed rounded-md py-8 px-4">
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                  <h3 className="mt-2 text-sm font-medium">Upload Letterhead</h3>
                                  <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG or PDF up to 5MB
                                  </p>
                                  <div className="mt-4">
                                    <input
                                      id="letterhead-upload"
                                      type="file"
                                      className="hidden"
                                      accept=".png,.jpg,.jpeg,.pdf"
                                      onChange={handleLetterheadUpload}
                                    />
                                    <label htmlFor="letterhead-upload">
                                      <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                                        <span>Choose File</span>
                                      </Button>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Default Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="default-company">Company Name</Label>
                            <Input id="default-company" placeholder="Your Company Name" />
                          </div>
                          <div>
                            <Label htmlFor="default-address">Company Address</Label>
                            <Textarea id="default-address" placeholder="123 Business St, City, Country" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="default-email">Email</Label>
                              <Input id="default-email" type="email" placeholder="contact@company.com" />
                            </div>
                            <div>
                              <Label htmlFor="default-phone">Phone</Label>
                              <Input id="default-phone" placeholder="+1 234 567 890" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
