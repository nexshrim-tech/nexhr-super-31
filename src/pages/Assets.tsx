
import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Import asset components
import AssetForm from "@/components/assets/AssetForm";
import AssetDetails from "@/components/assets/AssetDetails";
import AssetStats from "@/components/assets/AssetStats";
import AssetTable from "@/components/assets/AssetTable";

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
    const employeeId = asset.assignedTo 
      ? employees.find(e => e.name === asset.assignedTo.name)?.id.toString() 
      : null;
      
    setCurrentAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate,
      value: asset.value.toString(),
      assignedTo: employeeId,
      status: asset.status
    });
    
    // Set date for date picker if purchaseDate exists
    if (asset.purchaseDate) {
      setDate(new Date(asset.purchaseDate));
    }
    
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

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your asset inventory is being exported to CSV"
    });
  };

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
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <AssetStats assets={assetData} />

          <AssetTable 
            assets={filteredAssets}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onEdit={handleEditAssetOpen}
            onView={handleViewAsset}
          />
        </div>
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Enter the details for the new asset.
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleDateSelect={handleDateSelect}
            date={date}
            assetTypes={assetTypes}
            employees={employees}
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddAssetDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleAddAsset} className="w-full sm:w-auto">Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditAssetDialogOpen} onOpenChange={setIsEditAssetDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the details for this asset.
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleDateSelect={handleDateSelect}
            date={date}
            assetTypes={assetTypes}
            employees={employees}
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditAssetDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleEditAsset} className="w-full sm:w-auto">Update Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewAssetDialogOpen} onOpenChange={setIsViewAssetDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {currentAsset && (
            <AssetDetails 
              asset={currentAsset}
              onEdit={() => {
                setIsViewAssetDialogOpen(false);
                handleEditAssetOpen(currentAsset);
              }}
              onClose={() => setIsViewAssetDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
