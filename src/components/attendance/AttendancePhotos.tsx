
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Clock } from "lucide-react";

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

  const handlePhotoClick = (photo: AttendancePhoto) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  // Filter today's photos first, then others
  const formattedDate = date.toISOString().split('T')[0];
  const todayPhotos = photos.filter(p => p.date === formattedDate);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Attendance Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayPhotos.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Camera className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No attendance photos for selected date</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {todayPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="cursor-pointer group relative aspect-square"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="absolute inset-0 rounded-md bg-gradient-to-b from-black/10 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-2">
                  <div className="text-white text-sm font-medium">{photo.employeeName}</div>
                  <div className="flex items-center text-xs text-white/80">
                    <Clock className="h-3 w-3 mr-1" />
                    {photo.checkInTime || "No check-in"}
                  </div>
                </div>
                {photo.checkInPhoto ? (
                  <img 
                    src={photo.checkInPhoto} 
                    alt={`${photo.employeeName} check-in`} 
                    className="object-cover h-full w-full rounded-md"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                    <div className="text-sm text-gray-500">Time: {selectedPhoto.checkInTime || "Not recorded"}</div>
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
                    <div className="text-sm text-gray-500">Time: {selectedPhoto.checkOutTime || "Not recorded"}</div>
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
