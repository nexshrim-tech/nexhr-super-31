
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface AttendancePhoto {
  id: string;
  employeeName: string;
  timestamp: string;
  photoUrl: string;
}

interface AttendancePhotosProps {
  photos: AttendancePhoto[];
}

const AttendancePhotos = ({ photos }: AttendancePhotosProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Dialog key={photo.id}>
              <DialogTrigger asChild>
                <div className="cursor-pointer group relative">
                  <img
                    src={photo.photoUrl}
                    alt={`${photo.employeeName}'s attendance`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 text-white p-2 rounded-lg flex flex-col justify-end">
                    <div className="font-medium">{photo.employeeName}</div>
                    <div className="text-sm opacity-80">{photo.timestamp}</div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <img
                  src={photo.photoUrl}
                  alt={`${photo.employeeName}'s attendance`}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-2">
                  <h3 className="font-medium">{photo.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">{photo.timestamp}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendancePhotos;
