
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetFormProps {
  formData: {
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate: string;
    value: string;
    assignedTo: string | null;
    status: string;
    billDocument?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateSelect: (date: Date | undefined) => void;
  handleFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: Date | undefined;
  assetTypes: string[];
  employees: { id: number; name: string; avatar: string }[];
}

const AssetForm: React.FC<AssetFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleDateSelect,
  handleFileUpload,
  date,
  assetTypes,
  employees
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter asset name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Asset Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent className="pointer-events-auto">
              {assetTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            placeholder="Enter serial number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value ($) *</Label>
          <Input
            id="value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={handleInputChange}
            placeholder="Enter asset value"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="purchaseDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white pointer-events-auto" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="pointer-events-auto">
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Maintenance">In Maintenance</SelectItem>
              <SelectItem value="Disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Select 
          value={formData.assignedTo || "not-assigned"} 
          onValueChange={(value) => handleSelectChange("assignedTo", value === "not-assigned" ? null : value)}
        >
          <SelectTrigger id="assignedTo">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent className="pointer-events-auto">
            <SelectItem value="not-assigned">Not Assigned</SelectItem>
            {employees.map(employee => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billDocument" className="flex items-center gap-2">
          Purchase Bill (Optional)
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="billDocument"
            name="billDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="flex-1"
            onChange={handleFileUpload}
          />
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => document.getElementById('billDocument')?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
        {formData.billDocument && (
          <p className="text-sm text-green-600 mt-1">Bill document uploaded: {formData.billDocument}</p>
        )}
      </div>
    </div>
  );
};

export default AssetForm;
