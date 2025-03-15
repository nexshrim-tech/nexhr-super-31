
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Clock, Calendar, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttendancePhoto {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

interface AttendancePhotosProps {
  photos: AttendancePhoto[];
  date: Date;
}

const AttendancePhotos = ({ photos, date }: AttendancePhotosProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<AttendancePhoto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"checkIn" | "checkOut">("checkIn");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const handlePhotoClick = (photo: AttendancePhoto) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  // Filter today's photos first, then others
  const formattedDate = date.toISOString().split('T')[0];
  const filteredPhotos = photos.filter(p => {
    // Filter by date
    const matchesDate = p.date === formattedDate;
    
    // Filter by search term
    const matchesSearch = p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by check-in/check-out
    const matchesFilter = filter === "all" || 
                          (filter === "checkin" && p.checkInPhoto) ||
                          (filter === "checkout" && p.checkOutPhoto);
    
    return matchesDate && matchesSearch && matchesFilter;
  });

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Attendance Photos
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Photos</SelectItem>
              <SelectItem value="checkin">Check-in</SelectItem>
              <SelectItem value="checkout">Check-out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredPhotos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Camera className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>No attendance photos for selected date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="cursor-pointer group relative rounded-lg border overflow-hidden"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-2">
                    <div className="text-white text-sm font-medium">{photo.employeeName}</div>
                    <div className="flex items-center text-xs text-white/80">
                      <UserCheck className="h-3 w-3 mr-1" />
                      {photo.checkInTime ? `Check-in: ${photo.checkInTime}` : "No check-in"}
                    </div>
                  </div>
                  {photo.checkInPhoto ? (
                    <img 
                      src={photo.checkInPhoto} 
                      alt={`${photo.employeeName} check-in`} 
                      className="object-cover h-24 w-full"
                    />
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center bg-gray-100">
                      <Camera className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={photo.checkInPhoto} alt={photo.employeeName} />
                        <AvatarFallback>{photo.employeeName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-medium truncate">{photo.employeeName}</div>
                        <div className="text-[10px] text-gray-500 flex items-center">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          {photo.checkInTime || "No time"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedPhoto && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedPhoto.employeeName}'s Attendance</DialogTitle>
              </DialogHeader>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "checkIn" | "checkOut")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="checkIn">Check In</TabsTrigger>
                  <TabsTrigger value="checkOut">Check Out</TabsTrigger>
                </TabsList>
                <TabsContent value="checkIn" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="mr-1 h-4 w-4" /> 
                        {selectedPhoto.checkInTime || "Not recorded"}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" /> 
                        {format(new Date(selectedPhoto.date), "MMM dd, yyyy")}
                      </div>
                    </div>
                    {selectedPhoto.checkInPhoto ? (
                      <img 
                        src={selectedPhoto.checkInPhoto} 
                        alt="Check-in photo" 
                        className="w-full rounded-md"
                      />
                    ) : (
                      <div className="h-60 w-full flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">No check-in photo available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="checkOut" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="mr-1 h-4 w-4" /> 
                        {selectedPhoto.checkOutTime || "Not recorded"}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" /> 
                        {format(new Date(selectedPhoto.date), "MMM dd, yyyy")}
                      </div>
                    </div>
                    {selectedPhoto.checkOutPhoto ? (
                      <img 
                        src={selectedPhoto.checkOutPhoto} 
                        alt="Check-out photo" 
                        className="w-full rounded-md"
                      />
                    ) : (
                      <div className="h-60 w-full flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">No check-out photo available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AttendancePhotos;
