import React, { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Import asset components
import AssetStats from "@/components/assets/AssetStats";
import AssetTable from "@/components/assets/AssetTable";
import FilterSection from "@/components/assets/FilterSection";
import AssetDialogs from "@/components/assets/AssetDialogs";

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
    if (!formData.name || !formData.type || !formData.serialNumber || !formData.purchaseDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

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
    
    const employeeId = asset.assignedTo 
      ? employees.find(e => e.name === asset.assignedTo.name)?.id.toString() 
      : null;
    
    setFormData({
      name: asset.name,
      type: asset.type,
      serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate,
      value: asset.value.toString(),
      assignedTo: employeeId,
      status: asset.status
    });
    
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Asset Management
            </h1>
            <p className="text-gray-600">
              Track and manage your organization's assets
            </p>
          </div>

          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <FilterSection
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onAddAsset={openAddAssetDialog}
              onExport={handleExport}
            />
          </div>

          <div className="mt-6 transform hover:scale-[1.01] transition-all duration-300">
            <AssetStats assets={assetData} />
          </div>

          <div className="mt-6 transform hover:scale-[1.01] transition-all duration-300 border border-gray-200 rounded-lg shadow-md hover:shadow-lg bg-white">
            <AssetTable 
              assets={filteredAssets}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onEdit={handleEditAssetOpen}
              onView={handleViewAsset}
            />
          </div>
        </div>
      </div>

      <AssetDialogs
        isAddAssetDialogOpen={isAddAssetDialogOpen}
        setIsAddAssetDialogOpen={setIsAddAssetDialogOpen}
        isEditAssetDialogOpen={isEditAssetDialogOpen}
        setIsEditAssetDialogOpen={setIsEditAssetDialogOpen}
        isViewAssetDialogOpen={isViewAssetDialogOpen}
        setIsViewAssetDialogOpen={setIsViewAssetDialogOpen}
        currentAsset={currentAsset}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleDateSelect={handleDateSelect}
        date={date}
        assetTypes={assetTypes}
        employees={employees}
        handleAddAsset={handleAddAsset}
        handleEditAsset={handleEditAsset}
        handleEditAssetOpen={handleEditAssetOpen}
      />
    </div>
  );
};

export default Assets;
