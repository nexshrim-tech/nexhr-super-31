
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HolidayManagerProps {
  holidays: Date[];
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onHolidaysChange: (dates: Date[] | undefined) => void;
}

const HolidayManager = ({ 
  holidays, 
  isDialogOpen, 
  setIsDialogOpen, 
  onHolidaysChange 
}: HolidayManagerProps) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Manage Holidays
        </Button>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Holidays</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <CalendarComponent
                  mode="multiple"
                  selected={holidays}
                  onSelect={onHolidaysChange}
                  className="rounded-md border pointer-events-auto"
                />
                <div className="space-y-2">
                  <Label>Selected Holidays</Label>
                  <div className="flex flex-wrap gap-2">
                    {holidays.map((date) => (
                      <Badge 
                        key={date.toISOString()} 
                        variant="secondary"
                      >
                        {format(date, 'PPP')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HolidayManager;
