
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Plus, Search, Edit, Trash2, Eye, FilePlus, Calendar } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const initialAssetData = [
  {
    id: 1,
    name: "MacBook Pro M1",
    type: "Laptop",
    serialNumber: "MBP2021001",
    purchaseDate: "2021-06-15",
    value: 1999.99,
    assignedTo: { name: "Olivia Rhye", avatar: "OR" },
    status: "Assigned",
  },
  {
    id: 2,
    name: "Dell XPS 15",
    type: "Laptop",
    serialNumber: "XPS2022001",
    purchaseDate: "2022-01-10",
    value: 1599.99,
    assignedTo: { name: "Phoenix Baker", avatar: "PB" },
    status: "Assigned",
  },
  {
    id: 3,
    name: "iPhone 13 Pro",
    type: "Mobile Phone",
    serialNumber: "IP13P2021001",
    purchaseDate: "2021-09-25",
    value: 999.99,
    assignedTo: { name: "Lana Steiner", avatar: "LS" },
    status: "Assigned",
  },
  {
    id: 4,
    name: "Samsung Galaxy S22",
    type: "Mobile Phone",
    serialNumber: "SGS22001",
    purchaseDate: "2022-02-15",
    value: 899.99,
    assignedTo: null,
    status: "Available",
  },
  {
    id: 5,
    name: "LG Ultrawide Monitor 34\"",
    type: "Monitor",
    serialNumber: "LGM34001",
    purchaseDate: "2021-11-20",
    value: 699.99,
    assignedTo: { name: "Demi Wilkinson", avatar: "DW" },
    status: "Assigned",
  },
  {
    id: 6,
    name: "Logitech MX Master 3",
    type: "Mouse",
    serialNumber: "LMX3001",
    purchaseDate: "2021-08-05",
    value: 99.99,
    assignedTo: { name: "Candice Wu", avatar: "CW" },
    status: "Assigned",
  },
  {
    id: 7,
    name: "HP Color LaserJet Pro",
    type: "Printer",
    serialNumber: "HPLJP001",
    purchaseDate: "2022-03-10",
    value: 399.99,
    assignedTo: null,
    status: "In Maintenance",
  },
];

const employees = [
  { id: 1, name: "Olivia Rhye", avatar: "OR" },
  { id: 2, name: "Phoenix Baker", avatar: "PB" },
  { id: 3, name: "Lana Steiner", avatar: "LS" },
  { id: 4, name: "Demi Wilkinson", avatar: "DW" },
  { id: 5, name: "Candice Wu", avatar: "CW" },
  { id: 6, name: "Natali Craig", avatar: "NC" },
  { id: 7, name: "Drew Cano", avatar: "DC" },
];

const assetTypes = [
  "Laptop", 
  "Desktop", 
  "Mobile Phone", 
  "Tablet", 
  "Monitor", 
  "Keyboard", 
  "Mouse", 
  "Headset", 
  "Printer", 
  "Scanner", 
  "Projector", 
  "Camera", 
  "Other"
];

interface AssetFormData {
  id?: number;
  name: string;
  type: string;
  serialNumber: string;
  purchaseDate: string;
  value: string;
  assignedTo: string | null;
  status: string;
}

const Assets = () => {
  const [assetData, setAssetData] = useState(initialAssetData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isEditAssetDialogOpen, setIsEditAssetDialogOpen] = useState(false);
  const [isViewAssetDialogOpen, setIsViewAssetDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<any>(null);
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    type: "",
    serialNumber: "",
    purchaseDate: "",
    value: "",
    assignedTo: null,
    status: "Available"
  });
  const [date, setDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const filteredAssets = assetData.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAsset = () => {
    // Validate required fields
    if (!formData.name || !formData.type || !formData.serialNumber || !formData.purchaseDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create new asset
    const newAsset = {
      id: Math.max(...assetData.map(a => a.id)) + 1,
      name: formData.name,
      type: formData.type,
      serialNumber: formData.serialNumber,
      purchaseDate: formData.purchaseDate,
      value: parseFloat(formData.value),
      assignedTo: formData.assignedTo ? employees.find(e => e.id.toString() === formData.assignedTo) || null : null,
      status: formData.status
    };

    setAssetData([...assetData, newAsset]);
    setIsAddAssetDialogOpen(false);
    resetForm();
    toast({
      title: "Asset added",
      description: `${newAsset.name} has been added to the inventory.`
    });
  };

  const handleEditAsset = () => {
    if (!currentAsset) return;

    // Validate required fields
    if (!formData.name || !formData.type || !formData.serialNumber || !formData.purchaseDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedAssets = assetData.map(asset => {
      if (asset.id === currentAsset.id) {
        return {
          ...asset,
          name: formData.name,
          type: formData.type,
          serialNumber: formData.serialNumber,
          purchaseDate: formData.purchaseDate,
          value: parseFloat(formData.value),
          assignedTo: formData.assignedTo ? employees.find(e => e.id.toString() === formData.assignedTo) || null : null,
          status: formData.status
        };
      }
      return asset;
    });

    setAssetData(updatedAssets);
    setIsEditAssetDialogOpen(false);
    resetForm();
    toast({
      title: "Asset updated",
      description: `${formData.name} has been updated in the inventory.`
    });
  };

  const handleViewAsset = (asset: any) => {
    setCurrentAsset(asset);
    setIsViewAssetDialogOpen(true);
  };

  const handleEditAssetOpen = (asset: any) => {
    setCurrentAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate,
      value: asset.value.toString(),
      assignedTo: asset.assignedTo ? employees.find(e => e.name === asset.assignedTo.name)?.id.toString() || null : null,
      status: asset.status
    });
    
    // Set date for date picker
    setDate(new Date(asset.purchaseDate));
    
    setIsEditAssetDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      serialNumber: "",
      purchaseDate: "",
      value: "",
      assignedTo: null,
      status: "Available"
    });
    setDate(undefined);
    setCurrentAsset(null);
  };

  const openAddAssetDialog = () => {
    resetForm();
    setIsAddAssetDialogOpen(true);
  };

  // Handler for date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        purchaseDate: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };

  const renderAssetForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter asset name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Asset Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            placeholder="Enter serial number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value ($) *</Label>
          <Input
            id="value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={handleInputChange}
            placeholder="Enter asset value"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Maintenance">In Maintenance</SelectItem>
              <SelectItem value="Disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Select 
          value={formData.assignedTo || ""} 
          onValueChange={(value) => handleSelectChange("assignedTo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not Assigned</SelectItem>
            {employees.map(employee => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Asset Management</h1>
              <p className="text-gray-500">Track and manage company assets</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="flex items-center gap-2" onClick={openAddAssetDialog}>
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{assetData.length}</div>
                <p className="text-sm text-gray-500">
                  ${assetData.reduce((sum, asset) => sum + asset.value, 0).toFixed(2)} value
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {assetData.filter(asset => asset.status === "Assigned").length}
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round((assetData.filter(asset => asset.status === "Assigned").length / assetData.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {assetData.filter(asset => asset.status === "Available").length}
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round((assetData.filter(asset => asset.status === "Available").length / assetData.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {assetData.filter(asset => asset.status === "In Maintenance").length}
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round((assetData.filter(asset => asset.status === "In Maintenance").length / assetData.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Asset Inventory</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search assets..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                        <TableCell>{asset.purchaseDate}</TableCell>
                        <TableCell>${asset.value.toFixed(2)}</TableCell>
                        <TableCell>
                          {asset.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="" alt={asset.assignedTo.name} />
                                <AvatarFallback>{asset.assignedTo.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{asset.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              asset.status === "Assigned"
                                ? "bg-blue-100 text-blue-800"
                                : asset.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditAssetOpen(asset)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewAsset(asset)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Enter the details for the new asset.
            </DialogDescription>
          </DialogHeader>
          {renderAssetForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAssetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAsset}>Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditAssetDialogOpen} onOpenChange={setIsEditAssetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the details for this asset.
            </DialogDescription>
          </DialogHeader>
          {renderAssetForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAssetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAsset}>Update Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewAssetDialogOpen} onOpenChange={setIsViewAssetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {currentAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Asset Name</p>
                  <p className="font-medium">{currentAsset.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Asset Type</p>
                  <p className="font-medium">{currentAsset.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-medium">{currentAsset.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-medium">${currentAsset.value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium">{currentAsset.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    className={`${
                      currentAsset.status === "Assigned"
                        ? "bg-blue-100 text-blue-800"
                        : currentAsset.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {currentAsset.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Assigned To</p>
                {currentAsset.assignedTo ? (
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Avatar>
                      <AvatarFallback>{currentAsset.assignedTo.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentAsset.assignedTo.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Not assigned to any employee</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    setIsViewAssetDialogOpen(false);
                    handleEditAssetOpen(currentAsset);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit Asset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Asset report generated",
                      description: `Report for ${currentAsset.name} has been generated.`
                    });
                  }}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
