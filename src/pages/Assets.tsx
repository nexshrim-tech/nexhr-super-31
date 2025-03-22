
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  PlusCircle,
  Search,
  Filter,
  ClipboardList,
  FileText,
  Download,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AssetDialogs from '@/components/assets/AssetDialogs';
import AssetTable from '@/components/assets/AssetTable';
import AssetStats from '@/components/assets/AssetStats';
import FilterSection from '@/components/assets/FilterSection';
import { 
  fetchAssets, 
  fetchEmployees, 
  createAsset, 
  updateAsset, 
  deleteAsset, 
  getAssetBillUrl,
  getCurrentCustomerId,
  mapAssetForDatabase,
  mapAssetForFrontend,
  Asset as DbAsset,
  AssetFormData
} from '@/services/assetService';
import { useAuth } from '@/context/AuthContext';

// Frontend Asset interface
interface Asset {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
  value: number;
  purchaseDate: string;
  assignedTo: { name: string; avatar: string } | null;
  bill?: string;
}

// Employee interface for the dropdown
interface Employee {
  id: number;
  name: string;
  avatar: string;
}

const Assets = () => {
  // Auth context to check user role
  const { user } = useAuth();
  const { toast } = useToast();

  // State for assets data
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // State for dialogs
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);
  const [isEditAssetDialogOpen, setIsEditAssetDialogOpen] = useState(false);
  const [isViewAssetDialogOpen, setIsViewAssetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  
  // State for asset forms
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [billFile, setBillFile] = useState<File | null>(null);
  
  // Form data for new/edit asset
  const [formData, setFormData] = useState<AssetFormData>({
    assetname: '',
    assettype: '',
    serialnumber: '',
    purchasedate: '',
    assetvalue: '',
    assignedTo: null,
    assetstatus: 'Available',
  });
  
  // Asset types (could be fetched from API in a real app)
  const assetTypes = [
    'Laptop',
    'Desktop',
    'Mobile',
    'Tablet',
    'Monitor',
    'Printer',
    'Server',
    'Networking',
    'Furniture',
    'Other'
  ];
  
  // Fetch assets on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch assets from API
        const assetsData = await fetchAssets();
        const mappedAssets = assetsData.map(mapAssetForFrontend);
        setAssets(mappedAssets);
        setFilteredAssets(mappedAssets);
        
        // Fetch employees for dropdown
        const employeesData = await fetchEmployees();
        const mappedEmployees = employeesData.map(emp => ({
          id: emp.employeeid,
          name: `${emp.firstname} ${emp.lastname}`,
          avatar: `${emp.firstname[0]}${emp.lastname[0]}`
        }));
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error('Error loading assets:', error);
        toast({
          title: 'Error loading assets',
          description: 'There was a problem loading the assets. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Filter assets based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssets(assets);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = assets.filter(asset => 
        asset.name.toLowerCase().includes(lowercasedQuery) ||
        asset.type.toLowerCase().includes(lowercasedQuery) ||
        asset.serialNumber.toLowerCase().includes(lowercasedQuery) ||
        asset.status.toLowerCase().includes(lowercasedQuery) ||
        (asset.assignedTo?.name.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredAssets(filtered);
    }
  }, [searchQuery, assets]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({
        ...formData,
        purchasedate: format(date, 'yyyy-MM-dd')
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBillFile(e.target.files[0]);
      setFormData({
        ...formData,
        billDocument: e.target.files[0].name
      });
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      assetname: '',
      assettype: '',
      serialnumber: '',
      purchasedate: '',
      assetvalue: '',
      assignedTo: null,
      assetstatus: 'Available',
    });
    setSelectedDate(undefined);
    setBillFile(null);
  };
  
  // Open add asset dialog
  const handleAddAssetOpen = () => {
    resetForm();
    setIsAddAssetDialogOpen(true);
  };
  
  // Open edit asset dialog
  const handleEditAssetOpen = (asset: Asset) => {
    setCurrentAsset(asset);
    if (asset.purchaseDate) {
      setSelectedDate(new Date(asset.purchaseDate));
    }
    
    setFormData({
      assetname: asset.name,
      assettype: asset.type,
      serialnumber: asset.serialNumber,
      purchasedate: asset.purchaseDate,
      assetvalue: asset.value.toString(),
      assignedTo: asset.assignedTo ? asset.assignedTo.name.split(' ')[0] : null,
      assetstatus: asset.status,
    });
    
    setIsEditAssetDialogOpen(true);
  };
  
  // Open view asset dialog
  const handleViewAssetOpen = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsViewAssetDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteDialogOpen = (assetId: number) => {
    setAssetToDelete(assetId);
    setIsDeleteDialogOpen(true);
  };
  
  // Add a new asset
  const handleAddAsset = async () => {
    try {
      const customerId = await getCurrentCustomerId();
      
      if (!customerId) {
        toast({
          title: 'Error adding asset',
          description: 'Could not determine your company ID. Please try again or contact support.',
          variant: 'destructive',
        });
        return;
      }
      
      // Map form data to database format
      const assetData = mapAssetForDatabase(formData, customerId);
      
      // Create the asset
      const newAsset = await createAsset(assetData, billFile || undefined);
      
      // Map the new asset to frontend format and add it to the list
      const mappedAsset = mapAssetForFrontend(newAsset);
      setAssets(prevAssets => [...prevAssets, mappedAsset]);
      
      toast({
        title: 'Asset added',
        description: `${formData.assetname} has been added successfully.`,
      });
      
      resetForm();
      setIsAddAssetDialogOpen(false);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: 'Error adding asset',
        description: 'There was a problem adding the asset. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Update an existing asset
  const handleEditAsset = async () => {
    if (!currentAsset) return;
    
    try {
      const customerId = await getCurrentCustomerId();
      
      if (!customerId) {
        toast({
          title: 'Error updating asset',
          description: 'Could not determine your company ID. Please try again or contact support.',
          variant: 'destructive',
        });
        return;
      }
      
      // Map form data to database format
      const assetData = mapAssetForDatabase(formData, customerId);
      
      // Update the asset
      const updatedAsset = await updateAsset(currentAsset.id, assetData, billFile || undefined);
      
      // Map the updated asset to frontend format and update the list
      const mappedAsset = mapAssetForFrontend(updatedAsset);
      setAssets(prevAssets => prevAssets.map(asset => 
        asset.id === mappedAsset.id ? mappedAsset : asset
      ));
      
      toast({
        title: 'Asset updated',
        description: `${formData.assetname} has been updated successfully.`,
      });
      
      resetForm();
      setIsEditAssetDialogOpen(false);
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error updating asset',
        description: 'There was a problem updating the asset. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Delete an asset
  const handleDeleteAsset = async () => {
    if (!assetToDelete) return;
    
    try {
      await deleteAsset(assetToDelete);
      
      // Remove the asset from the list
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetToDelete));
      setFilteredAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetToDelete));
      
      toast({
        title: 'Asset deleted',
        description: 'The asset has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error deleting asset',
        description: 'There was a problem deleting the asset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };
  
  // Download asset bill
  const handleDownloadBill = async (billPath: string) => {
    if (!billPath) {
      toast({
        title: 'No bill available',
        description: 'No bill was uploaded for this asset.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const url = await getAssetBillUrl(billPath);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading bill:', error);
      toast({
        title: 'Error downloading bill',
        description: 'There was a problem downloading the bill. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Asset Management</h1>
      
      {/* Asset Statistics */}
      <div className="mb-6">
        <AssetStats assets={assets} />
      </div>
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="maintenance">In Maintenance</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32">
                <ClipboardList className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {assetTypes.map(type => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Add Asset Button - Only show for admins */}
        {user?.role === 'admin' && (
          <Button onClick={handleAddAssetOpen} className="ml-auto">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Asset
          </Button>
        )}
      </div>
      
      {/* Filter Tags (example) */}
      <FilterSection
        onClearFilters={() => {
          setSearchQuery('');
          setFilteredAssets(assets);
        }}
      />
      
      {/* Assets Table */}
      <AssetTable
        assets={filteredAssets}
        loading={loading}
        onView={handleViewAssetOpen}
        onEdit={user?.role === 'admin' ? handleEditAssetOpen : undefined}
        onDelete={user?.role === 'admin' ? handleDeleteDialogOpen : undefined}
        onDownloadBill={handleDownloadBill}
      />
      
      {/* Add/Edit/View Asset Dialogs */}
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
        date={selectedDate}
        assetTypes={assetTypes}
        employees={employees}
        handleAddAsset={handleAddAsset}
        handleEditAsset={handleEditAsset}
        handleEditAssetOpen={handleEditAssetOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAsset} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Assets;
