
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Download } from "lucide-react";

interface ExportManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  onExport: () => void;
}

const ExportManager = ({ 
  isDialogOpen, 
  setIsDialogOpen, 
  dateRange, 
  setDateRange, 
  onExport 
}: ExportManagerProps) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Attendance Data
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Attendance Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Select Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" className="mr-2" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onExport}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportManager;
