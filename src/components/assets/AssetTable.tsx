
import React from 'react';
import { Asset } from '@/services/assetService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface AssetTableProps {
  assets: Asset[];
  loading: boolean;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
        <p className="text-gray-500">Loading assets...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center h-64">
        <p className="text-gray-500 mb-4">No assets found</p>
        <p className="text-sm text-gray-400">Add a new asset to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Assets ({assets.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.assetid}>
                <TableCell className="font-medium">{asset.assetname}</TableCell>
                <TableCell>{asset.assettype}</TableCell>
                <TableCell>{asset.serialnumber}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(asset.assetstatus)}>
                    {asset.assetstatus}
                  </Badge>
                </TableCell>
                <TableCell>{formatValue(asset.assetvalue)}</TableCell>
                <TableCell>{formatDate(asset.purchasedate)}</TableCell>
                <TableCell>
                  {asset.employee ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                        {asset.employee.firstname[0]}
                        {asset.employee.lastname[0]}
                      </div>
                      <span>
                        {asset.employee.firstname} {asset.employee.lastname}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(asset)}
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(asset)}
                      title="Edit asset"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(asset)}
                      title="Delete asset"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetTable;
