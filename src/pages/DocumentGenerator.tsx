
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, ChevronRight, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const employeeData = [
  {
    id: "EMP001",
    name: "Olivia Rhye",
    email: "olivia@nexhr.com",
    department: "Design",
    role: "UI Designer",
    status: "Active",
    avatar: "OR",
    salary: "$85,000",
    startDate: "2022-03-15",
    address: "123 Main St, San Francisco, CA 94105",
    phone: "(555) 123-4567",
    manager: "Phoenix Baker",
  },
  {
    id: "EMP002",
    name: "Phoenix Baker",
    email: "phoenix@nexhr.com",
    department: "Product",
    role: "Product Manager",
    status: "Active",
    avatar: "PB",
    salary: "$95,000",
    startDate: "2021-06-10",
    address: "456 Market St, San Francisco, CA 94105",
    phone: "(555) 987-6543",
    manager: "Drew Cano",
  },
  {
    id: "EMP003",
    name: "Lana Steiner",
    email: "lana@nexhr.com",
    department: "Engineering",
    role: "Frontend Developer",
    status: "On Leave",
    avatar: "LS",
    salary: "$92,000",
    startDate: "2022-01-05",
    address: "789 Howard St, San Francisco, CA 94105",
    phone: "(555) 567-8901",
    manager: "Phoenix Baker",
  },
];

const documentTemplates = [
  {
    id: "offer-letter",
    name: "Offer Letter",
    description: "Employment offer letter for new employees",
    icon: <FileText className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-100",
    fields: ["name", "role", "department", "salary", "startDate", "manager"],
    template: `
Dear {{name}},

We are pleased to offer you the position of {{role}} in our {{department}} department at NexHR Inc. 

Your annual salary will be {{salary}}, paid on a bi-weekly basis. Your anticipated start date is {{startDate}}, contingent upon successful completion of background checks.

You will be reporting to {{manager}}. We believe your skills and experience are an excellent match for our company.

We look forward to welcoming you to the team!

Sincerely,
HR Department
NexHR Inc.
    `
  },
  {
    id: "termination-letter",
    name: "Termination Letter",
    description: "Employment termination notice",
    icon: <FileText className="w-8 h-8 text-red-500" />,
    color: "bg-red-100",
    fields: ["name", "role", "department", "startDate", "manager"],
    template: `
Dear {{name}},

This letter is to inform you that your employment with NexHR Inc. as {{role}} in the {{department}} department will end effective [End Date].

Your final paycheck will include all earned but unpaid wages and accrued but unused vacation time, minus applicable deductions.

All company property must be returned to your manager, {{manager}}, by your last day.

We wish you the best in your future endeavors.

Sincerely,
HR Department
NexHR Inc.
    `
  },
  {
    id: "salary-slip",
    name: "Salary Slip",
    description: "Monthly salary statement",
    icon: <FileText className="w-8 h-8 text-green-500" />,
    color: "bg-green-100",
    fields: ["name", "id", "role", "department", "salary"],
    template: `
SALARY SLIP
Employee: {{name}}
Employee ID: {{id}}
Position: {{role}}
Department: {{department}}

Basic Salary: {{salary}}
Allowances: [Amount]
Deductions: [Amount]
Net Pay: [Amount]

Payment Date: [Date]
Payment Method: Direct Deposit

This is a computer-generated document and does not require a signature.
    `
  },
  {
    id: "certificate",
    name: "Employment Certificate",
    description: "Employment verification certificate",
    icon: <FileText className="w-8 h-8 text-purple-500" />,
    color: "bg-purple-100",
    fields: ["name", "id", "role", "department", "startDate"],
    template: `
CERTIFICATE OF EMPLOYMENT

This is to certify that {{name}} (Employee ID: {{id}}) is employed at NexHR Inc. as a {{role}} in the {{department}} department since {{startDate}}.

This certification is issued upon the request of the employee for whatever legal purpose it may serve.

Issued on: [Current Date]

HR Director
NexHR Inc.
    `
  },
];

const DocumentGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredTemplates = documentTemplates.filter(
    (template) => 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setCustomFields({});
    setGeneratedContent("");
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    
    if (employeeId && selectedTemplate) {
      const employee = employeeData.find(emp => emp.id === employeeId);
      
      if (employee) {
        const newCustomFields: Record<string, string> = {};
        
        selectedTemplate.fields.forEach((field: string) => {
          if (field in employee) {
            newCustomFields[field] = employee[field as keyof typeof employee] as string;
          }
        });
        
        setCustomFields(newCustomFields);
      }
    }
  };

  const handleCustomFieldChange = (field: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;
    
    let content = selectedTemplate.template;
    
    Object.entries(customFields).forEach(([field, value]) => {
      content = content.replace(new RegExp(`{{${field}}}`, 'g'), value);
    });
    
    setGeneratedContent(content);
    setIsPreviewDialogOpen(true);
  };

  const downloadAsPDF = () => {
    toast({
      title: "Download started",
      description: "Your document is being downloaded as PDF.",
    });
    
    // In a real application, this would convert to PDF and trigger download
    setTimeout(() => {
      setIsPreviewDialogOpen(false);
    }, 1000);
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Document Generator</h1>
            <p className="text-gray-500">Generate HR documents and letters with automatic data filling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Document Templates</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search templates..."
                        className="pl-8 w-[180px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTemplates.map((template) => (
                      <div 
                        key={template.id}
                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                          selectedTemplate?.id === template.id 
                            ? 'bg-nexhr-primary/10 border border-nexhr-primary/30' 
                            : `${template.color} hover:bg-gray-100`
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex-shrink-0">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedTemplate 
                      ? `Generate ${selectedTemplate.name}` 
                      : "Select a document template"
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedTemplate ? (
                    <div className="text-center py-10">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Template Selected</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Please select a document template from the list to get started with document generation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="employee">Select Employee</Label>
                        <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose an employee..." />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeData.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                <div className="flex items-center gap-2">
                                  <span>{employee.name}</span>
                                  <span className="text-gray-500 text-xs">({employee.id})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedEmployee && (
                        <>
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-medium mb-3">Employee Information</h3>
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar>
                                <AvatarFallback>
                                  {employeeData.find(emp => emp.id === selectedEmployee)?.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {employeeData.find(emp => emp.id === selectedEmployee)?.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employeeData.find(emp => emp.id === selectedEmployee)?.role} • {employeeData.find(emp => emp.id === selectedEmployee)?.department}
                                </div>
                              </div>
                              <Badge className="ml-auto bg-green-100 text-green-800">
                                {employeeData.find(emp => emp.id === selectedEmployee)?.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-medium">Customize Document Fields</h3>
                            
                            {selectedTemplate.fields.map((field: string) => (
                              <div key={field} className="space-y-2">
                                <Label htmlFor={field} className="capitalize">
                                  {field.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <Input
                                  id={field}
                                  value={customFields[field] || ''}
                                  onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>

                          <Button 
                            className="w-full" 
                            onClick={generateDocument}
                            disabled={!selectedEmployee || Object.values(customFields).some(value => !value)}
                          >
                            Generate Document
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              Review your generated document before downloading
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white border rounded-md p-6 max-h-[500px] overflow-y-auto whitespace-pre-line">
            {generatedContent}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={downloadAsPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentGenerator;
