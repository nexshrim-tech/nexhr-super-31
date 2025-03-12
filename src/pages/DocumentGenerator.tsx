
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Printer, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const documentTemplates = [
  {
    id: 1,
    title: "Offer Letter",
    description: "Employment offer letter with terms and conditions",
    category: "Recruitment",
    lastUpdated: "2023-03-15",
  },
  {
    id: 2,
    title: "Employment Contract",
    description: "Formal employment agreement",
    category: "Recruitment",
    lastUpdated: "2023-02-20",
  },
  {
    id: 3,
    title: "Termination Letter",
    description: "Employee termination notification",
    category: "Offboarding",
    lastUpdated: "2023-04-10",
  },
  {
    id: 4,
    title: "Salary Increment Letter",
    description: "Notification of salary increase",
    category: "Compensation",
    lastUpdated: "2023-03-05",
  },
  {
    id: 5,
    title: "Warning Letter",
    description: "Employee warning for policy violation",
    category: "Discipline",
    lastUpdated: "2023-01-25",
  },
  {
    id: 6,
    title: "Salary Slip",
    description: "Monthly salary statement",
    category: "Compensation",
    lastUpdated: "2023-06-01",
  },
  {
    id: 7,
    title: "Experience Certificate",
    description: "Work experience verification",
    category: "Offboarding",
    lastUpdated: "2023-05-12",
  },
  {
    id: 8,
    title: "Promotion Letter",
    description: "Employee promotion notification",
    category: "Career Development",
    lastUpdated: "2023-04-28",
  },
];

const employees = [
  { id: "EMP001", name: "Olivia Rhye", department: "Design", avatar: "OR" },
  { id: "EMP002", name: "Phoenix Baker", department: "Engineering", avatar: "PB" },
  { id: "EMP003", name: "Lana Steiner", department: "Product", avatar: "LS" },
  { id: "EMP004", name: "Demi Wilkinson", department: "Marketing", avatar: "DW" },
  { id: "EMP005", name: "Candice Wu", department: "Customer Success", avatar: "CW" },
  { id: "EMP006", name: "Natali Craig", department: "Operations", avatar: "NC" },
  { id: "EMP007", name: "Drew Cano", department: "Finance", avatar: "DC" },
];

const DocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredTemplates = documentTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmployeeSelect = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleTemplateSelect = (id: number) => {
    setSelectedTemplate(id);
  };

  const generateDocument = () => {
    if (!selectedTemplate || !selectedEmployee) {
      toast({
        title: "Missing information",
        description: "Please select both a template and an employee",
        variant: "destructive",
      });
      return;
    }

    const template = documentTemplates.find((t) => t.id === selectedTemplate);
    const employee = employees.find((e) => e.id === selectedEmployee);

    toast({
      title: "Document generated",
      description: `${template?.title} generated for ${employee?.name}`,
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Document Generator</h1>
              <p className="text-gray-500">Create and manage HR documents</p>
            </div>
          </div>

          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="create">Create Document</TabsTrigger>
              <TabsTrigger value="templates">Document Templates</TabsTrigger>
              <TabsTrigger value="history">Generation History</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Select Template</CardTitle>
                    <CardDescription>Choose a document template to generate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search templates..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                        {filteredTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={`p-3 cursor-pointer transition-colors ${
                              selectedTemplate === template.id
                                ? "bg-nexhr-primary bg-opacity-10"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{template.title}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {template.description}
                                </div>
                              </div>
                              {selectedTemplate === template.id && (
                                <CheckCircle className="text-nexhr-primary h-5 w-5" />
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Updated: {template.lastUpdated}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Document Details</CardTitle>
                    <CardDescription>
                      Fill in the required information for the document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="employee">Employee</Label>
                        <Select onValueChange={handleEmployeeSelect} value={selectedEmployee}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                <div className="flex items-center gap-2">
                                  <span>{employee.name}</span>
                                  <span className="text-gray-500 text-xs">
                                    ({employee.department})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedTemplate && selectedEmployee && (
                        <div className="border p-4 rounded-md bg-gray-50 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {documentTemplates.find((t) => t.id === selectedTemplate)?.title}
                            </h3>
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="issueDate">Issue Date</Label>
                              <Input
                                id="issueDate"
                                type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div>
                              <Label htmlFor="effectiveDate">Effective Date</Label>
                              <Input
                                id="effectiveDate"
                                type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="additionalNotes">Additional Notes</Label>
                            <Input
                              id="additionalNotes"
                              placeholder="Add any special instructions or notes..."
                            />
                          </div>

                          <div className="pt-2">
                            <Label>Document Preview</Label>
                            <div className="border rounded-md p-4 mt-2 bg-white min-h-[200px] flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-40" />
                                <p>
                                  Preview will be available after generating the document
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        disabled={!selectedTemplate || !selectedEmployee}
                        onClick={() => {
                          toast({
                            title: "Document preview",
                            description: "Preview opened in a new tab",
                          });
                        }}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        disabled={!selectedTemplate || !selectedEmployee}
                        onClick={generateDocument}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate Document
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Document Templates</CardTitle>
                  <CardDescription>Manage your document templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documentTemplates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.title}</TableCell>
                            <TableCell>{template.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{template.category}</Badge>
                            </TableCell>
                            <TableCell>{template.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Generation History</CardTitle>
                  <CardDescription>Recent documents generated by you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead>Generated On</TableHead>
                          <TableHead>Generated By</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Offer Letter</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>OR</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>Olivia Rhye</div>
                                <div className="text-xs text-gray-500">EMP001</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>2023-06-15</TableCell>
                          <TableCell>Admin User</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Salary Slip</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>PB</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>Phoenix Baker</div>
                                <div className="text-xs text-gray-500">EMP002</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>2023-06-01</TableCell>
                          <TableCell>Admin User</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
