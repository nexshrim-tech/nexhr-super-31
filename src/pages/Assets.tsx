
import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Import asset components
import AssetStats from "@/components/assets/AssetStats";
import AssetTable from "@/components/assets/AssetTable";
import FilterSection from "@/components/assets/FilterSection";
import AssetDialogs from "@/components/assets/AssetDialogs";

// Import asset services
import { 
  fetchAssets, 
  createAsset, 
  updateAsset, 
  deleteAsset, 
  fetchEmployees,
  getCurrentCustomerId,
  Asset,
  AssetFormData
} from "@/services/assetService";

const Assets = () => {
  const [assetData, setAssetData] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isEditAssetDialogOpen, setIsEditAssetDialogOpen] = useState(false);
  const [isViewAssetDialogOpen, setIsViewAssetDialogOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>({
    assetname: "",
    assettype: "",
    serialnumber: "",
    purchasedate: "",
    assetvalue: "",
    assignedTo: null,
    assetstatus: "Available",
    billFile: null
  });
  const [date, setDate] = useState<Date | undefined>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const { toast } = useToast();

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

  // Fetch assets and employees when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get current customer ID
        const custId = await getCurrentCustomerId();
        setCustomerId(custId);
        
        // Fetch assets
        const assets = await fetchAssets();
        setAssetData(assets);
        
        // Fetch employees for assignment
        const emps = await fetchEmployees();
        setEmployees(emps);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load assets and employees. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Filter assets based on search term
  const filteredAssets = assetData.filter(asset => 
    asset.assetname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.serialnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assettype?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, billFile: e.target.files?.[0] || null }));
    }
  };

  // Add a new asset
  const handleAddAsset = async () => {
    if (!formData.assetname || !formData.assettype || !formData.serialnumber || !formData.purchasedate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare asset data
      const newAssetData: Partial<Asset> = {
        assetname: formData.assetname,
        assettype: formData.assettype,
        serialnumber: formData.serialnumber,
        purchasedate: formData.purchasedate,
        assetvalue: parseFloat(formData.assetvalue),
        employeeid: formData.assignedTo ? parseInt(formData.assignedTo) : undefined,
        assetstatus: formData.assetstatus,
        customerid: customerId || undefined
      };

      // Create asset with bill file if provided
      const newAsset = await createAsset(newAssetData, formData.billFile || undefined);
      
      // Update asset list
      setAssetData(prev => [...prev, newAsset]);
      setIsAddAssetDialogOpen(false);
      resetForm();
      
      toast({
        title: "Asset added",
        description: `${newAsset.assetname} has been added to the inventory.`
      });
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Error adding asset",
        description: "Failed to add asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Edit an existing asset
  const handleEditAsset = async () => {
    if (!currentAsset) return;

    if (!formData.assetname || !formData.assettype || !formData.serialnumber || !formData.purchasedate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare asset data
      const editedAssetData: Partial<Asset> = {
        assetname: formData.assetname,
        assettype: formData.assettype,
        serialnumber: formData.serialnumber,
        purchasedate: formData.purchasedate,
        assetvalue: parseFloat(formData.assetvalue),
        employeeid: formData.assignedTo ? parseInt(formData.assignedTo) : undefined,
        assetstatus: formData.assetstatus
      };

      // Update asset with bill file if provided
      const updatedAsset = await updateAsset(
        currentAsset.assetid, 
        editedAssetData, 
        formData.billFile || undefined
      );
      
      // Update asset list
      setAssetData(prev => prev.map(asset => 
        asset.assetid === currentAsset.assetid ? updatedAsset : asset
      ));
      
      setIsEditAssetDialogOpen(false);
      resetForm();
      
      toast({
        title: "Asset updated",
        description: `${updatedAsset.assetname} has been updated in the inventory.`
      });
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error updating asset",
        description: "Failed to update asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle delete asset
  const handleDeleteAsset = async (assetId: number) => {
    try {
      await deleteAsset(assetId);
      
      // Update asset list
      setAssetData(prev => prev.filter(asset => asset.assetid !== assetId));
      
      toast({
        title: "Asset deleted",
        description: "Asset has been removed from the inventory."
      });
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error deleting asset",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  // View asset details
  const handleViewAsset = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsViewAssetDialogOpen(true);
  };

  // Open edit asset dialog
  const handleEditAssetOpen = (asset: Asset) => {
    setCurrentAsset(asset);
    
    setFormData({
      assetname: asset.assetname,
      assettype: asset.assettype,
      serialnumber: asset.serialnumber,
      purchasedate: asset.purchasedate,
      assetvalue: asset.assetvalue.toString(),
      assignedTo: asset.employeeid ? asset.employeeid.toString() : null,
      assetstatus: asset.assetstatus,
      billFile: null
    });
    
    if (asset.purchasedate) {
      setDate(new Date(asset.purchasedate));
    }
    
    setIsEditAssetDialogOpen(true);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      assetname: "",
      assettype: "",
      serialnumber: "",
      purchasedate: "",
      assetvalue: "",
      assignedTo: null,
      assetstatus: "Available",
      billFile: null
    });
    setDate(undefined);
    setCurrentAsset(null);
  };

  // Open add asset dialog
  const openAddAssetDialog = () => {
    resetForm();
    setIsAddAssetDialogOpen(true);
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        purchasedate: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };

  // Export assets to CSV
  const handleExport = () => {
    // Create CSV content
    const headers = ["Asset Name", "Type", "Serial Number", "Status", "Value", "Purchase Date", "Assigned To"];
    
    const csvData = filteredAssets.map(asset => [
      asset.assetname,
      asset.assettype,
      asset.serialnumber,
      asset.assetstatus,
      asset.assetvalue,
      asset.purchasedate,
      asset.employee ? `${asset.employee.firstname} ${asset.employee.lastname}` : "Unassigned"
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `asset-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: "Your asset inventory has been exported to CSV"
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
              onDelete={handleDeleteAsset}
              isLoading={isLoading}
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
        handleFileChange={handleFileChange}
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
