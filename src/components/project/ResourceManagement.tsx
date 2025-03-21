
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types
interface Resource {
  id: string;
  name: string;
  type: string;
  assignedTo: string;
}

interface ResourceManagementProps {
  projectId?: number | string;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "document",
    assignedTo: "",
  });
  const [internalProjectId, setInternalProjectId] = useState("");
  const [isEditingProjectId, setIsEditingProjectId] = useState(false);
  const { toast } = useToast();

  // Generate a random project ID on component mount
  useEffect(() => {
    generateProjectId();
  }, [projectId]);

  const generateProjectId = () => {
    // If a projectId is passed, use it as part of the ID
    const prefix = projectId ? `PRJ-${projectId}-` : "PRJ-";
    const randomId = prefix + Math.random().toString(36).substring(2, 8).toUpperCase();
    setInternalProjectId(randomId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalProjectId(e.target.value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addResource = () => {
    if (!newResource.name || !newResource.type || !newResource.assignedTo) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const resource: Resource = {
      id: Math.random().toString(36).substring(2, 9),
      ...newResource,
    };

    setResources((prev) => [...prev, resource]);
    setNewResource({
      name: "",
      type: "document",
      assignedTo: "",
    });

    toast({
      title: "Resource added",
      description: "The resource has been added to the project.",
    });
  };

  const removeResource = (id: string) => {
    setResources((prev) => prev.filter((resource) => resource.id !== id));
    toast({
      title: "Resource removed",
      description: "The resource has been removed from the project.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Project Resources</h3>
          <p className="text-sm text-muted-foreground">
            Manage resources for this project
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Project ID</Label>
            <div className="flex items-center">
              <Input
                value={internalProjectId}
                onChange={handleProjectIdChange}
                className="h-8 w-[180px] text-sm"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-8 px-2" 
                onClick={generateProjectId}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Add a new resource to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newResource.name}
                    onChange={handleInputChange}
                    placeholder="Enter resource name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Select
                    value={newResource.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    name="assignedTo"
                    value={newResource.assignedTo}
                    onChange={handleInputChange}
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addResource}>
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[30%]">Type</TableHead>
              <TableHead className="w-[20%]">Assigned To</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {resource.type}
                    </span>
                  </TableCell>
                  <TableCell>{resource.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(resource.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  No resources added yet. Add your first resource.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResourceManagement;
