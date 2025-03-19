
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';

interface DocumentPreviewProps {
  documentContent: string;
  documentType: string;
  onBack: () => void;
  onDownload: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentContent,
  documentType,
  onBack,
  onDownload,
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
        <Button onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Document
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="border p-6 rounded-lg shadow-sm bg-white min-h-[500px] whitespace-pre-line overflow-auto font-serif">
            {documentContent}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPreview;
