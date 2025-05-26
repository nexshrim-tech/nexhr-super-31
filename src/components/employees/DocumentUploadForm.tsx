
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentFile {
  id: string;
  file: File | null;
  url?: string;
  name: string;
  documentType: string;
  isUploaded: boolean;
}

interface AdditionalDocument {
  id: string;
  file: File | null;
  url?: string;
  documentName: string;
  isUploaded: boolean;
}

interface DocumentUploadFormProps {
  onDocumentsChange: (documents: Record<string, string>) => void;
  employeeId?: string;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  onDocumentsChange,
  employeeId = 'temp'
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Mandatory documents
  const [mandatoryDocs, setMandatoryDocs] = useState<DocumentFile[]>([
    {
      id: 'aadhar',
      file: null,
      name: '',
      documentType: 'Aadhar Card',
      isUploaded: false
    },
    {
      id: 'pan',
      file: null,
      name: '',
      documentType: 'PAN Card',
      isUploaded: false
    }
  ]);

  // Additional documents
  const [additionalDocs, setAdditionalDocs] = useState<AdditionalDocument[]>([]);

  // Effect to trigger callback whenever documents change
  useEffect(() => {
    const documents: Record<string, string> = {};

    // Add mandatory documents
    mandatoryDocs.forEach(doc => {
      if (doc.isUploaded && doc.url) {
        documents[doc.id] = doc.url;
      }
    });

    // Add additional documents
    additionalDocs.forEach(doc => {
      if (doc.isUploaded && doc.url && doc.documentName.trim()) {
        documents[doc.documentName.toLowerCase().replace(/\s+/g, '_')] = doc.url;
      }
    });

    console.log('Updating documents callback with:', documents);
    onDocumentsChange(documents);
  }, [mandatoryDocs, additionalDocs, onDocumentsChange]);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${employeeId}/${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('employee-documents')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('employee-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleMandatoryFileChange = async (index: number, file: File | null) => {
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadFile(file, 'mandatory');

      // Update the specific document in the array
      setMandatoryDocs(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          file,
          url,
          name: file.name,
          isUploaded: true
        };
        console.log('Updated mandatory docs:', updated);
        return updated;
      });

      toast({
        title: "Success",
        description: `${mandatoryDocs[index].documentType} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalFileChange = async (index: number, file: File | null) => {
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadFile(file, 'additional');

      setAdditionalDocs(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          file,
          url,
          isUploaded: true
        };
        console.log('Updated additional docs:', updated);
        return updated;
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalDocumentNameChange = (index: number, name: string) => {
    setAdditionalDocs(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        documentName: name
      };
      return updated;
    });
  };

  const addAdditionalDocument = () => {
    setAdditionalDocs(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        file: null,
        documentName: '',
        isUploaded: false
      }
    ]);
  };

  const removeAdditionalDocument = (index: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== index));
  };

  const isMandatoryComplete = mandatoryDocs.every(doc => doc.isUploaded);

  return (
    <div className="space-y-6">
      {/* Mandatory Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-red-600">
            Mandatory Documents *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mandatoryDocs.map((doc, index) => (
            <div key={doc.id} className="space-y-2">
              <Label className="text-sm font-medium">{doc.documentType} *</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleMandatoryFileChange(index, e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                </div>
                {doc.isUploaded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <File className="h-4 w-4" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!isMandatoryComplete && (
            <p className="text-sm text-red-500">
              Both Aadhar Card and PAN Card are required
            </p>
          )}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Additional Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {additionalDocs.map((doc, index) => (
            <div key={doc.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Document {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAdditionalDocument(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Document Name</Label>
                  <Input
                    placeholder="e.g., Driving License, Educational Certificate"
                    value={doc.documentName}
                    onChange={(e) => handleAdditionalDocumentNameChange(index, e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Upload File</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleAdditionalFileChange(index, e.target.files?.[0] || null)}
                        disabled={uploading || !doc.documentName.trim()}
                      />
                    </div>
                    {doc.isUploaded && (
                      <div className="flex items-center gap-2 text-green-600">
                        <File className="h-4 w-4" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  {!doc.documentName.trim() && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please enter document name first
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addAdditionalDocument}
            className="w-full"
            disabled={uploading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Additional Document
          </Button>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">
        <p>Supported formats: PDF, JPG, PNG (Max 10MB each)</p>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
