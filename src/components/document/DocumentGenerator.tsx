
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateOfferLetter, generateSalarySlip, exportToPdf } from '@/utils/documentUtils';

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  fields: DocumentField[];
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'offer-letter',
    name: 'Offer Letter',
    description: 'Generate an offer letter for new employees',
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'salary', label: 'Salary', type: 'text', required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'appointment-letter',
    name: 'Appointment Letter',
    description: 'Generate an appointment letter',
    icon: <FileText className="h-8 w-8 text-green-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['3 months', '6 months', '1 year'], required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'experience-certificate',
    name: 'Experience Certificate',
    description: 'Generate an experience certificate for employees',
    icon: <FileText className="h-8 w-8 text-purple-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
      { id: 'achievements', label: 'Key Achievements', type: 'textarea' },
    ]
  },
  {
    id: 'relieving-letter',
    name: 'Relieving Letter',
    description: 'Generate a relieving letter for employees',
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { id: 'relievingDate', label: 'Relieving Date', type: 'date', required: true },
      { id: 'reason', label: 'Reason for Relieving', type: 'select', options: ['Resignation', 'Termination', 'End of Contract', 'Retirement', 'Other'], required: true },
      { id: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
    ]
  },
  {
    id: 'salary-slip',
    name: 'Salary Slip',
    description: 'Generate a salary slip for employees',
    icon: <FileText className="h-8 w-8 text-red-500" />,
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { id: 'month', label: 'Month', type: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], required: true },
      { id: 'year', label: 'Year', type: 'text', required: true },
      { id: 'basicSalary', label: 'Basic Salary', type: 'text', required: true },
      { id: 'allowances', label: 'Allowances', type: 'text', required: true },
      { id: 'deductions', label: 'Deductions', type: 'text', required: true },
    ]
  },
];

const DocumentGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<{content: string, type: string} | null>(null);
  const { toast } = useToast();

  const getValidationSchema = (template: DocumentTemplate) => {
    const schemaFields: Record<string, any> = {};
    
    template.fields.forEach(field => {
      if (field.required) {
        schemaFields[field.id] = z.string().min(1, `${field.label} is required`);
      } else {
        schemaFields[field.id] = z.string().optional();
      }
    });
    
    return z.object(schemaFields);
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setGeneratedDocument(null);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setGeneratedDocument(null);
  };

  const renderTemplateForm = (template: DocumentTemplate) => {
    const validationSchema = getValidationSchema(template);
    type FormValues = z.infer<typeof validationSchema>;
    
    const form = useForm<FormValues>({
      resolver: zodResolver(validationSchema),
      defaultValues: Object.fromEntries(template.fields.map(field => [field.id, ''])) as any,
    });

    const onSubmit = (data: FormValues) => {
      let documentContent = '';
      let documentType = template.id;

      // Generate content based on template type
      if (template.id === 'offer-letter') {
        documentContent = generateOfferLetter(
          {
            id: data.employeeId || '123456',
            name: data.employeeName,
            position: data.position,
            department: data.department,
            salary: parseFloat(data.salary) || 0,
            joiningDate: data.joiningDate,
            email: '',
            manager: '',
            address: '',
            phoneNumber: '',
          },
          { additionalNotes: data.additionalNotes }
        );
      } else if (template.id === 'salary-slip') {
        documentContent = generateSalarySlip(
          {
            id: data.employeeId,
            name: data.employeeName,
            position: data.position || 'Employee',
            department: data.department || 'N/A',
            salary: parseFloat(data.basicSalary) || 0,
            joiningDate: '',
            email: '',
            manager: '',
            address: '',
            phoneNumber: '',
          },
          {
            month: data.month,
            year: data.year,
            allowances: {
              basicSalary: parseFloat(data.basicSalary) || 0,
              hra: parseFloat(data.allowances) || 0,
              conveyanceAllowance: 0,
              medicalAllowance: 0,
              specialAllowance: 0,
              otherAllowances: 0,
            },
            deductions: {
              incomeTax: parseFloat(data.deductions) || 0,
              providentFund: 0,
              professionalTax: 0,
              loanDeduction: 0,
              otherDeductions: 0,
            }
          }
        );
      } else {
        // Generic template for other document types
        documentContent = `
          [Company Letterhead]
          
          Date: ${new Date().toLocaleDateString()}
          
          ${template.id.toUpperCase()}
          
          ${Object.entries(data).map(([key, value]) => {
            const field = template.fields.find(f => f.id === key);
            return field ? `${field.label}: ${value}\n` : '';
          }).join('')}
          
          Sincerely,
          
          [HR Manager Name]
          HR Manager
          [Company Name]
        `;
      }

      setGeneratedDocument({ content: documentContent, type: documentType });
      
      toast({
        title: 'Document Generated',
        description: `Your ${template.name} has been generated successfully.`
      });
    };

    const handleDownloadDocument = () => {
      if (generatedDocument) {
        exportToPdf(generatedDocument.content, `${template.id}-${Date.now()}.pdf`);
        
        toast({
          title: 'Document Downloaded',
          description: `Your ${template.name} has been downloaded.`
        });
      }
    };

    return (
      <div className="space-y-6">
        {generatedDocument ? (
          <div>
            <div className="flex items-center mb-4">
              <Button variant="ghost" onClick={() => setGeneratedDocument(null)} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Button>
              <Button onClick={handleDownloadDocument}>
                <Download className="h-4 w-4 mr-2" />
                Download Document
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="border p-6 rounded-lg shadow-sm bg-white min-h-[500px] whitespace-pre-line overflow-auto font-serif">
                  {generatedDocument.content}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {template.fields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </FormLabel>
                        <FormControl>
                          {field.type === 'textarea' ? (
                            <Textarea
                              {...formField}
                              placeholder={field.placeholder}
                            />
                          ) : field.type === 'select' ? (
                            <Select
                              value={formField.value}
                              onValueChange={formField.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              {...formField}
                              type={field.type}
                              placeholder={field.placeholder}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full">Generate Document</Button>
            </form>
          </Form>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Document Templates</CardTitle>
            <CardDescription>Select a template to generate a document</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {documentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start gap-3">
                      {template.icon}
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedTemplate ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedTemplate.icon}
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBackToTemplates}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderTemplateForm(selectedTemplate)}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Template</h3>
              <p className="text-gray-500">
                Choose a document template from the list on the left to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;
