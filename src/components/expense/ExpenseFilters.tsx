
import React, { useState } from 'react';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, X } from "lucide-react";

interface ExpenseFiltersProps {
  onFilter: (filters: {
    search: string;
    category: string;
    status: string;
    dateRange: DateRange | undefined;
    minAmount: number | undefined;
    maxAmount: number | undefined;
  }) => void;
  categories: string[];
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ onFilter, categories }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      search,
      category,
      status,
      dateRange: date,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setDate(undefined);
    setMinAmount("");
    setMaxAmount("");
    onFilter({
      search: "",
      category: "",
      status: "",
      dateRange: undefined,
      minAmount: undefined,
      maxAmount: undefined
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {isFilterExpanded ? "Hide Filters" : "Show Filters"}
        </Button>
        
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>

      {isFilterExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Min Amount ($)</label>
            <Input
              type="number"
              placeholder="Minimum"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Amount ($)</label>
            <Input
              type="number"
              placeholder="Maximum"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilters;
