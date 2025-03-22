
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Asset } from "@/services/assetService";
import { Skeleton } from "@/components/ui/skeleton";

interface AssetTableProps {
  assets: Asset[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (asset: Asset) => void;
  onView: (asset: Asset) => void;
  onDelete: (assetId: number) => void;
  isLoading: boolean;
}

const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  searchTerm,
  onSearchChange,
  onEdit,
  onView,
  onDelete,
  isLoading
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Asset Inventory</h2>
          <div className="relative w-64">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Asset Inventory</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-8"
          />
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No assets found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? "No assets match your search criteria. Try a different search term."
              : "Start adding assets to your inventory to track them."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.assetid}>
                  <TableCell>{asset.assetname}</TableCell>
                  <TableCell>{asset.assettype}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{asset.serialnumber}</span>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block 
                      ${asset.assetstatus === 'Assigned' ? 'bg-blue-100 text-blue-800' : 
                        asset.assetstatus === 'Available' ? 'bg-green-100 text-green-800' : 
                        asset.assetstatus === 'In Maintenance' ? 'bg-amber-100 text-amber-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {asset.assetstatus}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(asset.assetvalue)}</TableCell>
                  <TableCell>
                    {asset.employee ? (
                      <div className="flex items-center">
                        <div className="rounded-full bg-gray-100 w-6 h-6 flex items-center justify-center text-xs font-medium mr-2">
                          {asset.employee.firstname[0]}{asset.employee.lastname[0]}
                        </div>
                        <span>{asset.employee.firstname} {asset.employee.lastname}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(asset)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(asset)}
                        title="Edit asset"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(asset.assetid)}
                        title="Delete asset"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
