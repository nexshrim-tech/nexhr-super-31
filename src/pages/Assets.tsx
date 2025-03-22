
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Asset, AssetFormData, fetchAssets, createAsset, updateAsset, deleteAsset, fetchEmployees, getCurrentCustomerId, mapAssetForFrontend } from '@/services/assetService';
import AssetTable from '@/components/assets/AssetTable';
import AssetForm from '@/components/assets/AssetForm';
import AssetStats from '@/components/assets/AssetStats';
import AssetDetails from '@/components/assets/AssetDetails';
import FilterSection from '@/components/assets/FilterSection';
import AssetDialogs from '@/components/assets/AssetDialogs';
import { useAuth } from '@/context/AuthContext';
import { Separator } from "@/components/ui/separator";

const Assets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    assetType: '',
    status: '',
    assignedTo: ''
  });

  const [formData, setFormData] = useState<AssetFormData>({
    assetname: '',
    assettype: '',
    serialnumber: '',
    purchasedate: '',
    assetvalue: '',
    assignedTo: null,
    assetstatus: 'Available',
    billFile: null
  });

  // Fetch assets on component mount
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        // Get current customer ID
        const custId = await getCurrentCustomerId();
        setCustomerId(custId);

        if (custId) {
          // Fetch employee list for the dropdown
          const employeeList = await fetchEmployees();
          setEmployees(employeeList.map(emp => ({
            id: emp.employeeid.toString(),
            name: `${emp.firstname} ${emp.lastname}`
          })));

          // Fetch assets
          const assetList = await fetchAssets();
          setAssets(assetList);
          setFilteredAssets(assetList);
        }
      } catch (error) {
        console.error('Error loading assets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load assets. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let result = [...assets];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        asset => 
          asset.assetname.toLowerCase().includes(term) ||
          asset.serialnumber.toLowerCase().includes(term)
      );
    }

    if (filters.assetType) {
      result = result.filter(asset => asset.assettype === filters.assetType);
    }

    if (filters.status) {
      result = result.filter(asset => asset.assetstatus === filters.status);
    }

    if (filters.assignedTo) {
      result = result.filter(asset => asset.employeeid?.toString() === filters.assignedTo);
    }

    setFilteredAssets(result);
  }, [filters, assets]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      assetType: '',
      status: '',
      assignedTo: ''
    });
  };

  const resetFormData = () => {
    setFormData({
      assetname: '',
      assettype: '',
      serialnumber: '',
      purchasedate: '',
      assetvalue: '',
      assignedTo: null,
      assetstatus: 'Available',
      billFile: null
    });
  };

  const handleCreateAsset = async (formData: AssetFormData) => {
    if (!customerId) {
      toast({
        title: 'Error',
        description: 'Customer ID not found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const newAsset = await createAsset(
        {
          assetname: formData.assetname,
          assettype: formData.assettype,
          serialnumber: formData.serialnumber,
          assetstatus: formData.assetstatus,
          assetvalue: parseFloat(formData.assetvalue),
          purchasedate: formData.purchasedate,
          customerid: customerId,
          employeeid: formData.assignedTo ? parseInt(formData.assignedTo) : null
        },
        formData.billFile || undefined
      );

      setAssets(prev => [...prev, newAsset]);
      toast({
        title: 'Success',
        description: 'Asset created successfully',
      });
      setIsCreateDialogOpen(false);
      resetFormData();
    } catch (error) {
      console.error('Error creating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to create asset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = async (formData: AssetFormData) => {
    if (!selectedAsset || !customerId) return;

    try {
      setLoading(true);
      const updatedAsset = await updateAsset(
        selectedAsset.assetid,
        {
          assetname: formData.assetname,
          assettype: formData.assettype,
          serialnumber: formData.serialnumber,
          assetstatus: formData.assetstatus,
          assetvalue: parseFloat(formData.assetvalue),
          purchasedate: formData.purchasedate,
          employeeid: formData.assignedTo ? parseInt(formData.assignedTo) : null
        },
        formData.billFile || undefined
      );

      setAssets(prev => 
        prev.map(asset => 
          asset.assetid === updatedAsset.assetid ? updatedAsset : asset
        )
      );
      
      toast({
        title: 'Success',
        description: 'Asset updated successfully',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to update asset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;

    try {
      setLoading(true);
      await deleteAsset(selectedAsset.assetid);
      
      setAssets(prev => 
        prev.filter(asset => asset.assetid !== selectedAsset.assetid)
      );
      
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
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
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetFormData();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Asset Management</h1>
        <button
          onClick={openCreateDialog}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add New Asset
        </button>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AssetStats assets={filteredAssets} />
      </div>

      <FilterSection 
        assets={assets} 
        employees={employees} 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters}
      />

      <AssetTable
        assets={filteredAssets}
        loading={loading}
        onView={handleViewAsset}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AssetDialogs
        isCreateOpen={isCreateDialogOpen}
        isEditOpen={isEditDialogOpen}
        isDeleteOpen={isDeleteDialogOpen}
        isViewOpen={isViewDialogOpen}
        onCreateClose={() => setIsCreateDialogOpen(false)}
        onEditClose={() => setIsEditDialogOpen(false)}
        onDeleteClose={() => setIsDeleteDialogOpen(false)}
        onViewClose={() => setIsViewDialogOpen(false)}
        onConfirmDelete={handleDeleteAsset}
        formData={formData}
        setFormData={setFormData}
        onCreateSubmit={handleCreateAsset}
        onEditSubmit={handleEditAsset}
        employees={employees}
        selectedAsset={selectedAsset}
      />
    </div>
  );
};

export default Assets;
