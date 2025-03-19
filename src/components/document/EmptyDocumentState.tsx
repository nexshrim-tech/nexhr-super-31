
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const EmptyDocumentState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Template</h3>
        <p className="text-gray-500">
          Choose a document template from the list on the left to get started.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyDocumentState;
