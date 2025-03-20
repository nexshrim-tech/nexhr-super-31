
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  file?: File;
}

interface OfficialDocumentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
}

const DOCUMENT_TYPES = [
  { value: "offer-letter", label: "Offer Letter" },
  { value: "appointment-letter", label: "Appointment Letter" },
  { value: "appraisal-letter", label: "Appraisal Letter" },
  { value: "promotion-letter", label: "Promotion Letter" },
  { value: "warning-letter", label: "Warning Letter" },
  { value: "resignation-letter", label: "Resignation Letter" },
  { value: "termination-letter", label: "Termination Letter" },
  { value: "experience-letter", label: "Experience Letter" },
  { value: "relieving-letter", label: "Relieving Letter" },
  { value: "other", label: "Other" },
];

const sampleDocuments: Document[] = [
  { 
    id: "doc1", 
    name: "Offer_Letter_2023.pdf", 
    type: "offer-letter", 
    uploadDate: "Jan 15, 2023", 
    size: "1.2 MB" 
  },
  { 
    id: "doc2", 
    name: "Appraisal_Review_Q2.pdf", 
    type: "appraisal-letter", 
    uploadDate: "Jun 30, 2023", 
    size: "856 KB" 
  },
  { 
    id: "doc3", 
    name: "Promotion_Senior_Designer.pdf", 
    type: "promotion-letter", 
    uploadDate: "Aug 12, 2023", 
    size: "1.5 MB" 
  }
];

const OfficialDocumentsDialog: React.FC<OfficialDocumentsDialogProps> = ({
  isOpen,
  onClose,
  employeeName,
}) => {
  const [activeTab, setActiveTab] = useState("view");
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("offer-letter");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDocs: Document[] = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: documentType,
        uploadDate: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        file
      }));
      
      setDocuments(prev => [...newDocs, ...prev]);
      setSelectedFiles([]);
      setUploading(false);
      setActiveTab("view");
      
      toast({
        title: "Upload successful",
        description: `${newDocs.length} document${newDocs.length > 1 ? 's' : ''} uploaded successfully`,
      });
    }, 2000);
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getDocumentTypeBadgeColor = (type: string) => {
    switch (type) {
      case "offer-letter": return "bg-green-100 text-green-800";
      case "appointment-letter": return "bg-blue-100 text-blue-800";
      case "appraisal-letter": return "bg-purple-100 text-purple-800";
      case "promotion-letter": return "bg-amber-100 text-amber-800";
      case "warning-letter": return "bg-orange-100 text-orange-800";
      case "resignation-letter": return "bg-red-100 text-red-800";
      case "termination-letter": return "bg-rose-100 text-rose-800";
      case "experience-letter": return "bg-indigo-100 text-indigo-800";
      case "relieving-letter": return "bg-sky-100 text-sky-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.file) {
      // If we have the actual file object (for newly uploaded files)
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For sample documents, just show a toast
      toast({
        title: "Download started",
        description: `Downloading ${doc.name}`,
      });
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Official Documents</DialogTitle>
          <DialogDescription>
            View and manage official documents for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="view" className="flex-1">View Documents</TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">No documents uploaded yet</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          {doc.name}
                          <Badge className={`${getDocumentTypeBadgeColor(doc.type)} text-xs`}>
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleDownload(doc)}
                        >
                          Download
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Upload Documents</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  multiple
                  className="cursor-pointer"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files</Label>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          {activeTab === "upload" && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={selectedFiles.length === 0 || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          )}
          {activeTab === "view" && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfficialDocumentsDialog;
