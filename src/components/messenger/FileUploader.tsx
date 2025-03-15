
import React, { useState } from "react";
import { Upload, X, File, Image, FileText, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  allowedTypes = ["image/*", "application/pdf", "text/*", "audio/*", "video/*"],
  maxSize = 10
}) => {
  const [dragActive, setDragActive] = useState(false);
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
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
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
  
  return (
    <div className="relative">
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
    </div>
  );
};

export default FileUploader;
