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
  size: string;
  uploadedBy: string;
  uploadDate: string;
  accessLevel: "public" | "team" | "admin";
}

// Sample resources
const sampleResources: Resource[] = [
  {
    id: "1",
    name: "Project Requirements.docx",
    type: "document",
    size: "250 KB",
    uploadedBy: "Olivia Rhye",
    uploadDate: "2025-03-15",
    accessLevel: "team"
  },
  {
    id: "2",
    name: "Design Mockups.psd",
    type: "image",
    size: "4.2 MB",
    uploadedBy: "Phoenix Baker",
    uploadDate: "2025-03-20",
    accessLevel: "team"
  },
  {
    id: "3",
    name: "API Documentation.pdf",
    type: "document",
    size: "1.3 MB",
    uploadedBy: "Lana Steiner",
    uploadDate: "2025-03-25",
    accessLevel: "public"
  },
  {
    id: "4",
    name: "Source Code.zip",
    type: "archive",
    size: "15.1 MB",
    uploadedBy: "Demi Wilkinson",
    uploadDate: "2025-03-30",
    accessLevel: "admin"
  }
];

interface ResourceManagementProps {
  projectId: number;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [newAccessLevel, setNewAccessLevel] = useState<"public" | "team" | "admin">("team");
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const fileName = formData.get('fileName') as string;
    const fileType = formData.get('fileType') as string;
    const accessLevel = formData.get('accessLevel') as "public" | "team" | "admin";
    
    // Normally we'd handle the actual file upload to a server here
    
    // Create a new resource entry
    const newResource: Resource = {
      id: String(resources.length + 1),
      name: fileName,
      type: fileType,
      size: "1.0 MB", // Placeholder
      uploadedBy: "Current User", // Would be the logged-in user
      uploadDate: new Date().toISOString().split('T')[0],
      accessLevel
    };
    
    setResources([...resources, newResource]);
    setUploadDialogOpen(false);
    
    toast({
      title: "File uploaded",
      description: `${fileName} has been uploaded successfully.`
    });
  };
  
  const handleAccessChange = () => {
    if (!selectedResource) return;
    
    const updatedResources = resources.map(resource => 
      resource.id === selectedResource.id 
        ? { ...resource, accessLevel: newAccessLevel } 
        : resource
    );
    
    setResources(updatedResources);
    setAccessDialogOpen(false);
    
    toast({
      title: "Access level updated",
      description: `Access level for ${selectedResource.name} has been updated to ${newAccessLevel}.`
    });
  };
  
  const openAccessDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setNewAccessLevel(resource.accessLevel);
    setAccessDialogOpen(true);
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
  
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "public":
        return "bg-green-100 text-green-800";
      case "team":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Access</TableHead>
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
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccessLevelColor(resource.accessLevel)}`}
                          onClick={() => openAccessDialog(resource)}
                          style={{ cursor: 'pointer' }}
                        >
                          {resource.accessLevel}
                        </span>
                      </TableCell>
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
                {/* Similar table structure, but filtered for documents */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Access</TableHead>
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
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccessLevelColor(resource.accessLevel)}`}
                          onClick={() => openAccessDialog(resource)}
                          style={{ cursor: 'pointer' }}
                        >
                          {resource.accessLevel}
                        </span>
                      </TableCell>
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
          
          {/* Additional TabsContent for other types follow the same pattern */}
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
                      <span>{resource.size}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccessLevelColor(resource.accessLevel)}`}
                        onClick={() => openAccessDialog(resource)}
                        style={{ cursor: 'pointer' }}
                      >
                        {resource.accessLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Other tab contents would be similar */}
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
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Access</TableHead>
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
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.uploadedBy}</TableCell>
                      <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccessLevelColor(resource.accessLevel)}`}
                          onClick={() => openAccessDialog(resource)}
                          style={{ cursor: 'pointer' }}
                        >
                          {resource.accessLevel}
                        </span>
                      </TableCell>
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
              
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select name="accessLevel" defaultValue="team">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (All team members)</SelectItem>
                    <SelectItem value="team">Team (Project members)</SelectItem>
                    <SelectItem value="admin">Admin (Project managers only)</SelectItem>
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
      
      {/* Change Access Level Dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Access Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resource</Label>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                {selectedResource && getFileIcon(selectedResource.type)}
                <span className="font-medium">{selectedResource?.name}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newAccessLevel">Access Level</Label>
              <Select value={newAccessLevel} onValueChange={(value: "public" | "team" | "admin") => setNewAccessLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (All team members)</SelectItem>
                  <SelectItem value="team">Team (Project members)</SelectItem>
                  <SelectItem value="admin">Admin (Project managers only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {newAccessLevel === "public" && "Everyone in the organization will have access to this resource."}
                {newAccessLevel === "team" && "Only members of this project will have access to this resource."}
                {newAccessLevel === "admin" && "Only project managers and administrators will have access to this resource."}
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setAccessDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccessChange}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResourceManagement;
