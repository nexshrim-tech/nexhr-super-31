
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download } from 'lucide-react';

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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<boolean>(false);
  const { toast } = useToast();

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedDocument(false);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleGenerateDocument = () => {
    // Check if all required fields are filled
    if (selectedTemplate) {
      const missingFields = selectedTemplate.fields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        toast({
          title: 'Missing Fields',
          description: `Please fill in the following fields: ${missingFields.join(', ')}`,
          variant: 'destructive'
        });
        return;
      }
      
      // In a real application, this would generate the actual document
      setGeneratedDocument(true);
      
      toast({
        title: 'Document Generated',
        description: `Your ${selectedTemplate.name} has been generated successfully.`
      });
    }
  };

  const handleDownloadDocument = () => {
    toast({
      title: 'Document Downloaded',
      description: `Your ${selectedTemplate?.name} has been downloaded.`
    });
  };

  const renderField = (field: DocumentField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleFieldChange(field.id, value)}
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
        );
      default:
        return null;
    }
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
              <div className="flex items-center gap-3">
                {selectedTemplate.icon}
                <div>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {generatedDocument ? (
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                  <FileText className="h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">{selectedTemplate.name} Generated</h3>
                  <p className="text-gray-500 mb-6 text-center">
                    Your document has been generated successfully. You can now download it or go back to edit the details.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setGeneratedDocument(false)}>
                      Edit Details
                    </Button>
                    <Button onClick={handleDownloadDocument}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {!generatedDocument && (
              <CardFooter>
                <Button className="w-full" onClick={handleGenerateDocument}>
                  Generate Document
                </Button>
              </CardFooter>
            )}
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
