import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AssetForm from "@/components/assets/AssetForm";
import AssetDetails from "@/components/assets/AssetDetails";
import { Asset, mapAssetForFrontend } from "@/services/assetService";

interface Employee {
  id: string;
  name: string;
  avatar?: string;
}

export interface AssetDialogsProps {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  isViewOpen: boolean;
  onCreateClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onViewClose: () => void;
  onConfirmDelete: () => Promise<void>;
  formData: {
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate: string;
    value: string;
    assignedTo: string | null;
    status: string;
    billDocument?: string;
    billFile?: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate: string;
    value: string;
    assignedTo: string | null;
    status: string;
    billDocument?: string;
    billFile?: File | null;
  }>>;
  onCreateSubmit: (formData: any) => Promise<void>;
  onEditSubmit: (formData: any) => Promise<void>;
  employees: Employee[];
  selectedAsset: Asset | null;
}

const AssetDialogs: React.FC<AssetDialogsProps> = ({
  isCreateOpen,
  isEditOpen,
  isDeleteOpen,
  isViewOpen,
  onCreateClose,
  onEditClose,
  onDeleteClose,
  onViewClose,
  onConfirmDelete,
  formData,
  setFormData,
  onCreateSubmit,
  onEditSubmit,
  employees,
  selectedAsset
}) => {
  return (
    <>
      {/* Add Asset Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={onCreateClose}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Enter the details for the new asset.
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            formData={formData} 
            setFormData={setFormData}
            employees={employees}
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onCreateClose} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={() => onCreateSubmit(formData)} className="w-full sm:w-auto">Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditOpen} onOpenChange={onEditClose}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the details for this asset.
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            formData={formData} 
            setFormData={setFormData}
            employees={employees}
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onEditClose} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={() => onEditSubmit(formData)} className="w-full sm:w-auto">Update Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Asset Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={onDeleteClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onDeleteClose} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={onConfirmDelete} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewOpen} onOpenChange={onViewClose}>
        <DialogContent className="max-w-md md:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <AssetDetails 
              asset={mapAssetForFrontend(selectedAsset)}
              onEdit={() => {
                onViewClose();
              }}
              onClose={onViewClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetDialogs;
