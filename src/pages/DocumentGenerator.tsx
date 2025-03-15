
import React, { useState, useRef } from "react";
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
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Download, ChevronRight, FileDown, Upload, Image } from "lucide-react";
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

// Document template categories and documents
const documentCategories = [
  {
    id: "employee-management",
    name: "Employee Management",
    documents: [
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
        id: "appointment-letter",
        name: "Appointment Letter",
        description: "Official appointment letter confirming employment",
        icon: <FileText className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-100",
        fields: ["name", "role", "department", "salary", "startDate", "manager"],
        template: `
Dear {{name}},

With reference to your application and subsequent interviews with us, we are pleased to appoint you as {{role}} in our {{department}} department effective {{startDate}}.

Your compensation will be {{salary}} per annum. You will be reporting to {{manager}}.

Your appointment is subject to the terms and conditions detailed in the enclosed employment agreement.

We look forward to a long and successful association with you.

Sincerely,
HR Department
NexHR Inc.
        `
      },
      {
        id: "joining-letter",
        name: "Joining Letter",
        description: "Confirmation of joining details",
        icon: <FileText className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-100",
        fields: ["name", "role", "department", "startDate", "manager"],
        template: `
Dear {{name}},

We are delighted to confirm your joining as {{role}} in our {{department}} department on {{startDate}}.

On your first day, please report to the HR office at 9:00 AM with the following documents:
1. ID proof (passport/driving license)
2. Proof of address
3. Educational certificates
4. Previous employment documents

Your reporting manager will be {{manager}}.

We are excited to have you on board!

Warm regards,
HR Department
NexHR Inc.
        `
      },
      {
        id: "employee-agreement",
        name: "Employee Agreement",
        description: "Employment contract with terms and conditions",
        icon: <FileText className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-100",
        fields: ["name", "role", "department", "startDate"],
        template: `
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made and entered into on [Date] by and between NexHR Inc. ("Company") and {{name}} ("Employee").

1. POSITION: The Employee is hired for the position of {{role}} in the {{department}} department.

2. COMMENCEMENT: This Agreement commences on {{startDate}}.

3. DUTIES: The Employee agrees to perform all duties assigned by the Company to the best of their ability.

4. COMPENSATION: [Details of salary, bonuses, and benefits]

5. CONFIDENTIALITY: The Employee agrees to maintain the confidentiality of all proprietary information.

6. TERMINATION: [Terms of termination]

7. GOVERNING LAW: This Agreement shall be governed by the laws of [State/Country].

Signed:

________________________
For NexHR Inc.

________________________
{{name}} (Employee)
        `
      },
      {
        id: "nda",
        name: "Non-Disclosure Agreement",
        description: "Confidentiality agreement for employees",
        icon: <FileText className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-100",
        fields: ["name", "role", "department"],
        template: `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("NDA") is entered into by and between NexHR Inc. ("Company") and {{name}}, {{role}} in the {{department}} department ("Employee").

1. CONFIDENTIAL INFORMATION: "Confidential Information" means any information disclosed by the Company to the Employee, either directly or indirectly, that is designated as confidential or would reasonably be understood to be confidential.

2. OBLIGATIONS: The Employee agrees to:
   a) Maintain the confidentiality of all Confidential Information
   b) Use Confidential Information only for the purpose of performing their duties
   c) Not disclose Confidential Information to any third party without prior written consent

3. TERM: This obligation shall continue during employment and for a period of [X] years after termination.

4. RETURN OF MATERIALS: Upon termination, the Employee shall return all materials containing Confidential Information.

Signed:

________________________
For NexHR Inc.

________________________
{{name}} (Employee)
        `
      }
    ]
  },
  {
    id: "performance",
    name: "Performance & Appraisal",
    documents: [
      {
        id: "performance-review",
        name: "Performance Review Form",
        description: "Annual employee performance evaluation form",
        icon: <FileText className="w-8 h-8 text-purple-500" />,
        color: "bg-purple-100",
        fields: ["name", "role", "department", "manager"],
        template: `
PERFORMANCE REVIEW FORM

Employee: {{name}}
Position: {{role}}
Department: {{department}}
Manager: {{manager}}
Review Period: [Start Date] to [End Date]

PERFORMANCE RATING
[  ] Exceeds Expectations
[  ] Meets Expectations
[  ] Needs Improvement
[  ] Unsatisfactory

KEY ACHIEVEMENTS:
1. 
2. 
3. 

AREAS FOR IMPROVEMENT:
1. 
2. 
3. 

DEVELOPMENT PLAN:
1. 
2. 
3. 

Employee Comments:


Manager Comments:


Next Review Date: [Date]

Signatures:

________________________
Employee: {{name}}

________________________
Manager: {{manager}}
        `
      },
      {
        id: "promotion-letter",
        name: "Promotion Letter",
        description: "Official promotion notification",
        icon: <FileText className="w-8 h-8 text-purple-500" />,
        color: "bg-purple-100",
        fields: ["name", "role", "department", "manager"],
        template: `
Dear {{name}},

It is with great pleasure that I inform you of your promotion from [Previous Position] to {{role}} in the {{department}} department, effective [Effective Date].

This promotion is in recognition of your outstanding performance, dedication, and the valuable contributions you have made to our organization since joining.

In your new role, you will report to {{manager}}. Your new compensation package will be communicated separately by the HR department.

We are confident that you will excel in your new role and continue to be an asset to our organization.

Congratulations on your well-deserved promotion!

Warm regards,

[Sender's Name]
[Sender's Title]
NexHR Inc.
        `
      },
      {
        id: "warning-letter",
        name: "Warning Letter",
        description: "Performance warning notification",
        icon: <FileText className="w-8 h-8 text-red-500" />,
        color: "bg-red-100",
        fields: ["name", "role", "department", "manager"],
        template: `
Subject: Warning Letter for Performance Issues

Dear {{name}},

This letter serves as a formal warning regarding your performance as {{role}} in the {{department}} department.

In the past [period], the following issues have been observed:
1. [Specific issue]
2. [Specific issue]
3. [Specific issue]

These issues have been previously discussed with you on [dates of verbal discussions].

You are expected to show improvement in the following areas:
1. [Area for improvement]
2. [Area for improvement]
3. [Area for improvement]

Your performance will be reviewed again on [date] by your manager, {{manager}}. Failure to improve may result in further disciplinary action.

We hope to see positive changes in your performance moving forward.

Sincerely,

HR Department
NexHR Inc.
        `
      }
    ]
  },
  {
    id: "exit",
    name: "Exit & Termination",
    documents: [
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
        id: "resignation-template",
        name: "Resignation Letter Template",
        description: "Template for employee resignation",
        icon: <FileText className="w-8 h-8 text-red-500" />,
        color: "bg-red-100",
        fields: ["name", "role", "department", "manager"],
        template: `
[Current Date]

Dear {{manager}},

I am writing to formally notify you of my resignation from the position of {{role}} in the {{department}} department at NexHR Inc.

As per my employment contract, I am providing [notice period] notice, making my last working day [Last Working Day].

I appreciate the opportunities for professional development that you have provided during my time at NexHR Inc. I have enjoyed working with the team and am grateful for the support provided to me during my tenure.

During the transition period, I am committed to completing my current projects and assisting in the handover process to ensure a smooth transition.

Thank you again for the opportunity to work at NexHR Inc.

Sincerely,

{{name}}
[Contact Information]
        `
      },
      {
        id: "experience-letter",
        name: "Experience Letter",
        description: "Confirmation of employment experience",
        icon: <FileText className="w-8 h-8 text-green-500" />,
        color: "bg-green-100",
        fields: ["name", "role", "department", "startDate"],
        template: `
TO WHOM IT MAY CONCERN

This is to certify that {{name}} was employed with NexHR Inc. as {{role}} in the {{department}} department from {{startDate}} to [End Date].

During their tenure with us, {{name}} demonstrated excellent [skills/qualities] and made significant contributions to [specific areas/projects].

We found {{name}} to be a dedicated and capable professional who consistently met or exceeded performance expectations.

We wish {{name}} all the best in their future endeavors.

Sincerely,

[Authorized Signatory]
[Title]
NexHR Inc.
[Contact Information]
        `
      }
    ]
  },
  {
    id: "attendance",
    name: "Attendance & Leave",
    documents: [
      {
        id: "leave-request",
        name: "Leave Request Form",
        description: "Form to apply for leave",
        icon: <FileText className="w-8 h-8 text-yellow-500" />,
        color: "bg-yellow-100",
        fields: ["name", "role", "department", "manager"],
        template: `
LEAVE REQUEST FORM

Employee Name: {{name}}
Employee ID: [ID]
Position: {{role}}
Department: {{department}}
Manager: {{manager}}

Type of Leave:
[  ] Annual Leave
[  ] Sick Leave
[  ] Personal Leave
[  ] Maternity/Paternity Leave
[  ] Bereavement Leave
[  ] Other: _________________

Leave Period:
From: [Start Date]
To: [End Date]
Total Number of Days: [Number]

Reason for Leave:
[Text area for reason]

Contact During Leave: [Phone/Email]

Employee Signature: _________________
Date: [Date]

FOR OFFICIAL USE ONLY
[  ] Approved
[  ] Rejected
Reason (if rejected): _________________

Manager Signature: _________________
Date: [Date]

HR Signature: _________________
Date: [Date]
        `
      },
      {
        id: "work-from-home",
        name: "Work From Home Request",
        description: "Form to request remote work",
        icon: <FileText className="w-8 h-8 text-yellow-500" />,
        color: "bg-yellow-100",
        fields: ["name", "role", "department", "manager"],
        template: `
WORK FROM HOME REQUEST FORM

Employee Name: {{name}}
Position: {{role}}
Department: {{department}}
Manager: {{manager}}

WFH Period:
[  ] Single Day: [Date]
[  ] Multiple Days: From [Start Date] to [End Date]
[  ] Regular Arrangement: [Specify days/schedule]

Reason for WFH Request:
[Text area for reason]

Work Plan During WFH:
[Text area for work plan]

Available Contact Information:
Phone: [Phone Number]
Email: [Email Address]

I confirm that I have suitable work arrangements at home including necessary equipment and internet connectivity to perform my job effectively.

Employee Signature: _________________
Date: [Date]

FOR OFFICIAL USE ONLY
[  ] Approved
[  ] Rejected
Reason (if rejected): _________________

Manager Signature: _________________
Date: [Date]
        `
      }
    ]
  },
  {
    id: "compliance",
    name: "Compliance & Legal",
    documents: [
      {
        id: "confidentiality-agreement",
        name: "Confidentiality Agreement",
        description: "Legal document for information protection",
        icon: <FileText className="w-8 h-8 text-indigo-500" />,
        color: "bg-indigo-100",
        fields: ["name", "role", "department"],
        template: `
CONFIDENTIALITY AGREEMENT

This Confidentiality Agreement ("Agreement") is entered into on [Date] by and between:

NexHR Inc., a company registered under the laws of [State/Country] ("Company")

AND

{{name}}, {{role}} in the {{department}} department ("Recipient")

WHEREAS the Recipient will have access to confidential and proprietary information belonging to the Company in the course of their employment.

NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
   [Definition of confidential information]

2. OBLIGATIONS OF THE RECIPIENT
   [Detailed obligations]

3. EXCLUSIONS
   [Exclusions from confidential information]

4. TERM AND TERMINATION
   [Duration and termination provisions]

5. REMEDIES
   [Legal remedies for breach]

6. GOVERNING LAW
   [Applicable law]

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

FOR NEXHR INC.:
_________________________
Name:
Title:

RECIPIENT:
_________________________
{{name}}
        `
      },
      {
        id: "company-policies",
        name: "Company Policies",
        description: "Standard company policies document",
        icon: <FileText className="w-8 h-8 text-indigo-500" />,
        color: "bg-indigo-100",
        fields: ["name", "role", "department"],
        template: `
ACKNOWLEDGMENT OF COMPANY POLICIES

I, {{name}}, currently employed as {{role}} in the {{department}} department, hereby acknowledge that I have received, read, and understood the following company policies:

1. Code of Conduct
2. Anti-Harassment Policy
3. Data Protection and Privacy Policy
4. IT Security Policy
5. Social Media Policy
6. Health and Safety Policy
7. Equal Opportunity Policy
8. Conflict of Interest Policy

I understand that these policies form part of my terms and conditions of employment and that failure to comply with them may result in disciplinary action, up to and including termination of employment.

I agree to abide by these policies and any future amendments that may be made to them.

Employee Name: {{name}}
Employee Signature: _________________
Date: [Date]

HR Representative: _________________
Date: [Date]
        `
      }
    ]
  },
  {
    id: "certificates",
    name: "Certificates",
    documents: [
      {
        id: "training-certificate",
        name: "Training Certificate",
        description: "Certificate for completed training programs",
        icon: <FileText className="w-8 h-8 text-green-500" />,
        color: "bg-green-100",
        fields: ["name", "role", "department"],
        template: `
CERTIFICATE OF COMPLETION

This is to certify that

{{name}}
{{role}}, {{department}}

has successfully completed the training program on

[TRAINING PROGRAM NAME]

conducted from [Start Date] to [End Date]
for a total of [Number] hours

[Brief description of training content and skills acquired]

Date of Issue: [Issue Date]

_________________________
[Training Instructor Name]
Training Instructor

_________________________
[HR Manager Name]
HR Manager
NexHR Inc.
        `
      },
      {
        id: "internship-certificate",
        name: "Internship Certificate",
        description: "Certificate for completed internships",
        icon: <FileText className="w-8 h-8 text-green-500" />,
        color: "bg-green-100",
        fields: ["name", "role", "department"],
        template: `
INTERNSHIP CERTIFICATE

This is to certify that

{{name}}

has successfully completed an internship as

{{role}}

in the {{department}} department at NexHR Inc.
from [Start Date] to [End Date].

During the internship period, {{name}} worked on the following projects:
1. [Project 1]
2. [Project 2]
3. [Project 3]

{{name}} demonstrated excellent [skills/qualities] and made valuable contributions to the team.

We wish {{name}} all the best for their future endeavors.

Date: [Issue Date]

_________________________
[Supervisor Name]
[Supervisor Title]

_________________________
[HR Manager Name]
HR Manager
NexHR Inc.
        `
      }
    ]
  }
];

const DocumentGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("employee-management");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [letterhead, setLetterhead] = useState<string | null>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredTemplates = selectedCategory 
    ? documentCategories.find(cat => cat.id === selectedCategory)?.documents.filter(
        template => 
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          template.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : documentCategories.flatMap(cat => cat.documents).filter(
        template => 
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

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterhead(event.target?.result as string);
        toast({
          title: "Letterhead uploaded",
          description: "Your letterhead has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <Card className="h-full">
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
                <CardContent className="pt-2 pb-6">
                  <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-4">
                    <TabsList className="w-full flex overflow-x-auto hide-scrollbar pb-1">
                      {documentCategories.map((category) => (
                        <TabsTrigger 
                          key={category.id} 
                          value={category.id}
                          className="flex-shrink-0"
                        >
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
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
                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No templates found matching your search.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-8">
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

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium">Company Letterhead</h3>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => letterheadInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4" />
                                Upload Letterhead
                              </Button>
                              <input
                                type="file"
                                ref={letterheadInputRef}
                                onChange={handleLetterheadUpload}
                                accept="image/*"
                                className="hidden"
                              />
                            </div>
                            
                            {letterhead ? (
                              <div className="relative h-24 bg-white border rounded overflow-hidden mb-3">
                                <img 
                                  src={letterhead} 
                                  alt="Company Letterhead" 
                                  className="w-full h-full object-contain"
                                />
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                                  onClick={() => setLetterhead(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="h-24 bg-gray-50 border border-dashed rounded flex flex-col items-center justify-center text-gray-500 mb-3">
                                <Image className="h-6 w-6 mb-1" />
                                <p className="text-xs">No letterhead uploaded</p>
                              </div>
                            )}
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
          
          <div className="bg-white border rounded-md p-6 max-h-[500px] overflow-y-auto">
            {letterhead && (
              <div className="mb-6 flex justify-center">
                <img src={letterhead} alt="Letterhead" className="max-h-24 w-auto" />
              </div>
            )}
            <div className="whitespace-pre-line">
              {generatedContent}
            </div>
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
