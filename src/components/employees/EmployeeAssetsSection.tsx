
import React from "react";
import { Card } from "@/components/ui/card";

interface EmployeeAssetsSectionProps {
  assets: any[]; // Using any[] as we don't have specific asset type info
}

const EmployeeAssetsSection: React.FC<EmployeeAssetsSectionProps> = ({ assets }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Assets</h2>
      <Card className="bg-white p-6 rounded-lg border shadow-sm">
        {assets.length > 0 ? (
          <div>
            {/* Asset list would go here */}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No assets/List</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeAssetsSection;
