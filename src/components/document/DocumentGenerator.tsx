
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateOfferLetter, generateSalarySlip, exportToPdf } from '@/utils/documentUtils';
import { DocumentTemplate, GeneratedDocument } from '@/types/documents';
import documentTemplates from '@/data/documentTemplates';
import TemplateSelector from './TemplateSelector';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import EmptyDocumentState from './EmptyDocumentState';

const DocumentGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const { toast } = useToast();

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setGeneratedDocument(null);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setGeneratedDocument(null);
  };

  const handleFormSubmit = (data: any) => {
    if (!selectedTemplate) return;
    
    let documentContent = '';
    let documentType = selectedTemplate.id;

    // Generate content based on template type
    if (selectedTemplate.id === 'offer-letter') {
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
    } else if (selectedTemplate.id === 'salary-slip') {
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
        
        ${selectedTemplate.id.toUpperCase()}
        
        ${Object.entries(data).map(([key, value]) => {
          const field = selectedTemplate.fields.find(f => f.id === key);
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
      description: `Your ${selectedTemplate.name} has been generated successfully.`
    });
  };

  const handleDownloadDocument = () => {
    if (generatedDocument) {
      exportToPdf(generatedDocument.content, `${selectedTemplate?.id}-${Date.now()}.pdf`);
      
      toast({
        title: 'Document Downloaded',
        description: `Your ${selectedTemplate?.name} has been downloaded.`
      });
    }
  };

  const handleBackToForm = () => {
    setGeneratedDocument(null);
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
            <TemplateSelector 
              templates={documentTemplates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
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
              {generatedDocument ? (
                <DocumentPreview 
                  documentContent={generatedDocument.content}
                  documentType={generatedDocument.type}
                  onBack={handleBackToForm}
                  onDownload={handleDownloadDocument}
                />
              ) : (
                <DocumentForm 
                  template={selectedTemplate}
                  onSubmit={handleFormSubmit}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <EmptyDocumentState />
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;
