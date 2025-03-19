
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateOfferLetter, generateSalarySlip, exportToPdf } from '@/utils/documentUtils';
import { DocumentTemplate, GeneratedDocument, DocumentCategory } from '@/types/documents';
import documentTemplates, { documentCategories } from '@/data/documentTemplates';
import TemplateSelector from './TemplateSelector';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import EmptyDocumentState from './EmptyDocumentState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DocumentGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const { toast } = useToast();

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setGeneratedDocument(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
    setGeneratedDocument(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedTemplate(null);
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
        
        ${selectedTemplate.name.toUpperCase()}
        
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

  const renderContent = () => {
    if (selectedTemplate) {
      return (
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
              <Button variant="ghost" size="sm" onClick={selectedCategory ? handleBackToTemplates : handleBackToCategories}>
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
      );
    } else if (selectedCategory) {
      // Show templates for the selected category
      const categoryTemplates = documentTemplates.filter(t => t.category === selectedCategory);
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{documentCategories.find(c => c.id === selectedCategory)?.name}</CardTitle>
                <CardDescription>Select a template to generate a document</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleBackToCategories}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TemplateSelector 
              templates={categoryTemplates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </CardContent>
        </Card>
      );
    } else {
      // Show categories
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documentCategories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>
                  {category.templates.length} templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {category.templates.slice(0, 3).map((template) => (
                    <div key={template.id} className="flex items-center gap-2">
                      {template.icon}
                      <span className="text-sm">{template.name}</span>
                    </div>
                  ))}
                  {category.templates.length > 3 && (
                    <span className="text-sm text-gray-500">+{category.templates.length - 3} more</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default DocumentGenerator;
