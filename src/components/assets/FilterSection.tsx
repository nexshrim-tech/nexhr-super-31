
import React from 'react';
import { Asset } from '@/services/assetService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterSectionProps {
  assets: Asset[];
  employees: { id: string; name: string }[];
  filters: {
    searchTerm: string;
    assetType: string;
    status: string;
    assignedTo: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  assets,
  employees,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  // Extract unique asset types from data
  const assetTypes = Array.from(new Set(assets.map(asset => asset.assettype)))
    .filter(Boolean)
    .sort();

  // Extract unique statuses from data
  const statuses = Array.from(new Set(assets.map(asset => asset.assetstatus)))
    .filter(Boolean)
    .sort();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name or serial..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="assetType">Asset Type</Label>
          <Select
            value={filters.assetType}
            onValueChange={(value) => onFilterChange('assetType', value)}
          >
            <SelectTrigger id="assetType">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {assetTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select
            value={filters.assignedTo}
            onValueChange={(value) => onFilterChange('assignedTo', value)}
          >
            <SelectTrigger id="assignedTo">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
