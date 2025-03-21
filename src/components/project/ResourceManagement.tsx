
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Paperclip, File, Image, FileCode, FileArchive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
}

// Sample resources
const sampleResources: Resource[] = [
  {
    id: "1",
    name: "Project Requirements.docx",
    type: "document",
    uploadedBy: "Olivia Rhye",
    uploadDate: "2025-03-15"
  },
  {
    id: "2",
    name: "Design Mockups.psd",
    type: "image",
    uploadedBy: "Phoenix Baker",
    uploadDate: "2025-03-20"
  },
  {
    id: "3",
    name: "API Documentation.pdf",
    type: "document",
    uploadedBy: "Lana Steiner",
    uploadDate: "2025-03-25"
  },
  {
    id: "4",
    name: "Source Code.zip",
    type: "archive",
    uploadedBy: "Demi Wilkinson",
    uploadDate: "2025-03-30"
  }
];

interface ResourceManagementProps {
  projectId: number;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;
    
    // Normally we'd handle the actual file upload to a server here
    
    // Create a new resource entry
    const newResource: Resource = {
      id: String(resources.length + 1),
      name: fileName,
      type: fileType,
      uploadedBy: "Current User", // Would be the logged-in user
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setResources([...resources, newResource]);
    setUploadDialogOpen(false);
    
    toast({
      title: "File uploaded",
      description: `${fileName} has been uploaded successfully.`
    });
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "code":
        return <FileCode className="h-5 w-5 text-purple-500" />;
      case "archive":
        return <FileArchive className="h-5 w-5 text-yellow-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Resources</CardTitle>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="archives">Archives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="flex items-center space-x-2">
                        {getFileIcon(resource.type)}
                        <span>{resource.name}</span>
                      </TableCell>
                      <TableCell className="capitalize">{resource.type}</TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.filter(r => r.type === "document").map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="flex items-center space-x-2">
                        {getFileIcon(resource.type)}
                        <span>{resource.name}</span>
                      </TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {resources.filter(r => r.type === "image").map((resource) => (
                  <div key={resource.id} className="border rounded-md p-4 space-y-2">
                    <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
                      <Image className="h-10 w-10 text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{resource.name}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{resource.uploadedBy}</span>
                      <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="code" className="mt-0">
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              No code files found.
            </div>
          </TabsContent>
          
          <TabsContent value="archives" className="mt-0">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.filter(r => r.type === "archive").map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="flex items-center space-x-2">
                        {getFileIcon(resource.type)}
                        <span>{resource.name}</span>
                      </TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Upload File Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFileUpload}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">File Name</Label>
                <Input id="fileName" name="fileName" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileInput">Select File</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
                  <Paperclip className="h-8 w-8 mb-2" />
                  <p className="text-sm mb-1">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-400">Max file size: 50MB</p>
                  <Input id="fileInput" type="file" className="mt-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select name="fileType" defaultValue="document">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResourceManagement;
