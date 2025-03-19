
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentTemplate } from '@/types/documents';

interface TemplateSelectorProps {
  templates: DocumentTemplate[];
  selectedTemplate: DocumentTemplate | null;
  onTemplateSelect: (template: DocumentTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
}) => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedTemplate?.id === template.id
                ? 'bg-blue-50 border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onTemplateSelect(template)}
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
  );
};

export default TemplateSelector;
