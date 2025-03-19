
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Signature } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}>
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
            
            <div className="mt-16 pb-8">
              <div className="border-t pt-4 w-48">
                <div className="flex items-center mb-1">
                  <Signature className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-500">Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPreview;
