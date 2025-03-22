
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

interface Asset {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  purchaseDate: string;
  value: number;
  assignedTo: { name: string; avatar: string } | null;
  status: string;
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
}

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

interface AssetDialogsProps {
  isAddAssetDialogOpen: boolean;
  setIsAddAssetDialogOpen: (isOpen: boolean) => void;
  isEditAssetDialogOpen: boolean;
  setIsEditAssetDialogOpen: (isOpen: boolean) => void;
  isViewAssetDialogOpen: boolean;
  setIsViewAssetDialogOpen: (isOpen: boolean) => void;
  currentAsset: Asset | null;
  formData: AssetFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateSelect: (selectedDate: Date | undefined) => void;
  date: Date | undefined;
  assetTypes: string[];
  employees: Employee[];
  handleAddAsset: () => void;
  handleEditAsset: () => void;
  handleEditAssetOpen: (asset: Asset) => void;
}

const AssetDialogs: React.FC<AssetDialogsProps> = ({
  isAddAssetDialogOpen,
  setIsAddAssetDialogOpen,
  isEditAssetDialogOpen,
  setIsEditAssetDialogOpen,
  isViewAssetDialogOpen,
  setIsViewAssetDialogOpen,
  currentAsset,
  formData,
  handleInputChange,
  handleSelectChange,
  handleDateSelect,
  date,
  assetTypes,
  employees,
  handleAddAsset,
  handleEditAsset,
  handleEditAssetOpen
}) => {
  return (
    <>
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
          {currentAsset && (
            <>
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
            </>
          )}
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
    </>
  );
};

export default AssetDialogs;
