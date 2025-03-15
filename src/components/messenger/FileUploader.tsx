
import React, { useState } from "react";
import { Upload, X, File, Image, FileText, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  showPreview?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  allowedTypes = ["image/*", "application/pdf", "text/*", "audio/*", "video/*"],
  maxSize = 10,
  showPreview = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;
    const isValidType = allowedTypes.some(type => {
      if (type.includes("*")) {
        const mainType = type.split("/")[0];
        return fileType.startsWith(mainType);
      }
      return type === fileType;
    });
    
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please upload a supported file type",
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const processFile = (file: File) => {
    if (validateFile(file)) {
      if (showPreview) {
        setPreviewFile(file);
      }
      onFileSelect(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image')) return <Image className="h-5 w-5" />;
    if (type.startsWith('application/pdf')) return <FileText className="h-5 w-5" />;
    if (type.startsWith('text')) return <FileText className="h-5 w-5" />;
    if (type.startsWith('video')) return <Film className="h-5 w-5" />;
    if (type.startsWith('audio')) return <Music className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };
  
  const clearPreview = () => {
    setPreviewFile(null);
  };
  
  return (
    <div className="relative">
      {previewFile && showPreview ? (
        <div className="mb-3 relative">
          {previewFile.type.startsWith('image') ? (
            <div className="relative rounded-md overflow-hidden border border-gray-200">
              <img 
                src={URL.createObjectURL(previewFile)} 
                alt="Preview" 
                className="max-h-[150px] max-w-full object-contain" 
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                onClick={clearPreview}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center p-2 border rounded-md bg-gray-50">
              <div className="flex items-center flex-1 overflow-hidden">
                {getFileTypeIcon(previewFile.type)}
                <span className="ml-2 text-sm truncate">{previewFile.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(previewFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={clearPreview}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`flex items-center justify-center border-2 border-dashed rounded-md p-4 transition-colors ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            onChange={handleChange}
            className="hidden"
            accept={allowedTypes.join(",")}
          />
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports images, documents, audio, and video up to {maxSize}MB
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
