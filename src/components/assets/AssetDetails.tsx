
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssetDetailsProps {
  asset: {
    id: number;
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate: string;
    value: number;
    assignedTo: { name: string; avatar: string } | null;
    status: string;
    bill?: string;
  };
  onEdit: () => void;
  onClose: () => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, onEdit, onClose }) => {
  const { toast } = useToast();

  const handleViewBill = () => {
    if (asset.bill) {
      // If we had a real bill document, we would open it here
      toast({
        title: "Viewing bill",
        description: `Opening bill for ${asset.name}`,
      });
    } else {
      toast({
        title: "No bill available",
        description: "No bill was uploaded for this asset.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Asset Name</p>
          <p className="font-medium">{asset.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Asset Type</p>
          <p className="font-medium">{asset.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Serial Number</p>
          <p className="font-medium">{asset.serialNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="font-medium">${asset.value.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Purchase Date</p>
          <p className="font-medium">{asset.purchaseDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <Badge
            className={`${
              asset.status === "Assigned"
                ? "bg-blue-100 text-blue-800"
                : asset.status === "Available"
                ? "bg-green-100 text-green-800"
                : asset.status === "In Maintenance"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {asset.status}
          </Badge>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-2">Assigned To</p>
        {asset.assignedTo ? (
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Avatar>
              <AvatarFallback>{asset.assignedTo.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{asset.assignedTo.name}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Not assigned to any employee</p>
        )}
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Edit Asset
        </Button>
        <Button
          variant="outline"
          onClick={handleViewBill}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Bill
        </Button>
      </div>
    </div>
  );
};

export default AssetDetails;
