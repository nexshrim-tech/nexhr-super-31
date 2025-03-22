
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterSectionProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddAsset: () => void;
  onExport: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  onSearchChange,
  onAddAsset,
  onExport
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Asset Management</h1>
        <p className="text-gray-500">Track and manage company assets</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="flex items-center gap-2" onClick={onAddAsset}>
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
