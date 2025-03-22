
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Asset, AssetFormData, fetchAssets, createAsset, updateAsset, deleteAsset, fetchEmployees, getCurrentCustomerId, mapAssetForFrontend } from '@/services/assetService';
import AssetTable from '@/components/assets/AssetTable';
import AssetStats from '@/components/assets/AssetStats';
import FilterSection from '@/components/assets/FilterSection';
import AssetDialogs from '@/components/assets/AssetDialogs';
import { useAuth } from '@/context/AuthContext';
import { Separator } from "@/components/ui/separator";

interface Employee {
  id: number;
  name: string;
  avatar: string;
}

const Assets = () => {
  const { toast } = useToast();
  const { user, customerData } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
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

  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate: string;
    value: string;
    assignedTo: string | null;
    status: string;
    billDocument?: string;
    billFile?: File | null;
  }>({
    name: '',
    type: '',
    serialNumber: '',
    purchaseDate: '',
    value: '',
    assignedTo: null,
    status: 'Available',
    billDocument: '',
    billFile: null
  });

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const custId = customerData?.customerid || await getCurrentCustomerId();
        setCustomerId(custId);

        if (custId) {
          const employeeList = await fetchEmployees();
          setEmployees(employeeList.map(emp => ({
            id: emp.employeeid,
            name: `${emp.firstname} ${emp.lastname}`,
            avatar: `${emp.firstname[0]}${emp.lastname[0]}`
          })));

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
  }, [toast, customerData]);

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
      name: '',
      type: '',
      serialNumber: '',
      purchaseDate: '',
      value: '',
      assignedTo: null,
      status: 'Available',
      billDocument: '',
      billFile: null
    });
  };

  const mapFormToServiceData = (formData: typeof Assets.prototype.formData): AssetFormData => {
    return {
      assetname: formData.name,
      assettype: formData.type,
      serialnumber: formData.serialNumber,
      purchasedate: formData.purchaseDate,
      assetvalue: formData.value,
      assignedTo: formData.assignedTo,
      assetstatus: formData.status,
      billFile: formData.billFile
    };
  };

  const handleCreateAsset = async (formDataInput: typeof Assets.prototype.formData) => {
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
      const serviceFormData = mapFormToServiceData(formDataInput);
      
      const newAsset = await createAsset(
        {
          assetname: serviceFormData.assetname,
          assettype: serviceFormData.assettype,
          serialnumber: serviceFormData.serialnumber,
          assetstatus: serviceFormData.assetstatus,
          assetvalue: parseFloat(serviceFormData.assetvalue),
          purchasedate: serviceFormData.purchasedate,
          customerid: customerId,
          employeeid: serviceFormData.assignedTo ? parseInt(serviceFormData.assignedTo) : null
        },
        serviceFormData.billFile || undefined
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

  const handleEditAsset = async (formDataInput: typeof Assets.prototype.formData) => {
    if (!selectedAsset || !customerId) return;

    try {
      setLoading(true);
      const serviceFormData = mapFormToServiceData(formDataInput);
      
      const updatedAsset = await updateAsset(
        selectedAsset.assetid,
        {
          assetname: serviceFormData.assetname,
          assettype: serviceFormData.assettype,
          serialnumber: serviceFormData.serialnumber,
          assetstatus: serviceFormData.assetstatus,
          assetvalue: parseFloat(serviceFormData.assetvalue),
          purchasedate: serviceFormData.purchasedate,
          employeeid: serviceFormData.assignedTo ? parseInt(serviceFormData.assignedTo) : null
        },
        serviceFormData.billFile || undefined
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
      name: asset.assetname,
      type: asset.assettype,
      serialNumber: asset.serialnumber,
      purchaseDate: asset.purchasedate,
      value: asset.assetvalue.toString(),
      assignedTo: asset.employeeid ? asset.employeeid.toString() : null,
      status: asset.assetstatus,
      billDocument: asset.billpath,
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
          onClick={() => setIsCreateDialogOpen(true)}
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
        employees={employees.map(emp => ({
          id: String(emp.id), // Convert id to string to match the expected type
          name: emp.name,
          avatar: emp.avatar
        }))}
        selectedAsset={selectedAsset}
      />
    </div>
  );
};

export default Assets;
