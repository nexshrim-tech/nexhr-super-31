
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  documentType: string;
}

interface DocumentDropZoneProps {
  onDocumentsUpload: (documents: UploadedDocument[]) => void;
  employeeId?: string;
}

const DocumentDropZone: React.FC<DocumentDropZoneProps> = ({
  onDocumentsUpload,
  employeeId = 'temp'
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving-license', label: 'Driving License' },
    { value: 'education', label: 'Educational Certificate' },
    { value: 'experience', label: 'Experience Letter' },
    { value: 'other', label: 'Other Document' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploading) return;

    setUploading(true);
    const newDocuments: UploadedDocument[] = [];

    try {
      for (const file of files) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `File ${file.name} is too large. Maximum size is 10MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${employeeId}/documents/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        // Upload file
        const { data, error } = await supabase.storage
          .from('employee-documents')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('employee-documents')
          .getPublicUrl(fileName);

        newDocuments.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
          name: file.name,
          type: file.type,
          url: publicUrl,
          documentType: '' // Will be set when user selects type
        });
      }

      setDocuments(prev => [...prev, ...newDocuments]);
      onDocumentsUpload([...documents, ...newDocuments]);

      toast({
        title: "Success",
        description: `${newDocuments.length} document(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Error",
        description: "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    onDocumentsUpload(updatedDocuments);
  };

  const updateDocumentType = (id: string, documentType: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, documentType } : doc
    );
    setDocuments(updatedDocuments);
    onDocumentsUpload(updatedDocuments);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {uploading ? 'Uploading...' : 'Drop documents here or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            Supports PDF, JPG, PNG up to 10MB each
          </p>
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('document-input')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
        <input
          id="document-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Uploaded Documents</Label>
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <File className="h-5 w-5 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <div className="mt-1">
                    <Select
                      value={doc.documentType}
                      onValueChange={(value) => updateDocumentType(doc.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDocument(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentDropZone;
