
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetStatsProps {
  assets: any[];
}

const AssetStats: React.FC<AssetStatsProps> = ({ assets }) => {
  const assignedAssets = assets.filter(asset => asset.status === "Assigned");
  const availableAssets = assets.filter(asset => asset.status === "Available");
  const maintenanceAssets = assets.filter(asset => asset.status === "In Maintenance");
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{assets.length}</div>
          <p className="text-sm text-gray-500">
            ${totalValue.toFixed(2)} value
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Assigned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {assignedAssets.length}
          </div>
          <p className="text-sm text-gray-500">
            {assets.length > 0 
              ? Math.round((assignedAssets.length / assets.length) * 100)
              : 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {availableAssets.length}
          </div>
          <p className="text-sm text-gray-500">
            {assets.length > 0
              ? Math.round((availableAssets.length / assets.length) * 100)
              : 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {maintenanceAssets.length}
          </div>
          <p className="text-sm text-gray-500">
            {assets.length > 0
              ? Math.round((maintenanceAssets.length / assets.length) * 100)
              : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetStats;
