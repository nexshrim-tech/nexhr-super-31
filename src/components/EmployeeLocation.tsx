
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Location {
  id?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  employee: {
    id: string;
    name: string;
    job: string;
    avatar?: string;
  } | null;
}

interface EmployeeLocationProps {
  locations?: Location[];
}

const EmployeeLocation = ({ locations = [] }: EmployeeLocationProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Group locations by employee
  const employeeLocations = locations.reduce((acc, location) => {
    if (!location.employee) return acc;
    
    const employeeId = location.employee.id;
    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: location.employee,
        lastLocation: location,
        history: [location],
      };
    } else {
      acc[employeeId].history.push(location);
      // Update last location if this one is newer
      if (new Date(location.timestamp) > new Date(acc[employeeId].lastLocation.timestamp)) {
        acc[employeeId].lastLocation = location;
      }
    }
    return acc;
  }, {} as Record<string, { employee: Location['employee']; lastLocation: Location; history: Location[] }>);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md border-t-4 border-indigo-400">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Employee Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(employeeLocations).length > 0 ? (
              Object.values(employeeLocations).map(({ employee, lastLocation }) => (
                <div
                  key={employee?.id || 'unknown'}
                  className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleLocationClick(lastLocation)}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={employee?.avatar} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {employee?.name ? employee.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{employee?.name || 'Unknown Employee'}</p>
                    <p className="text-sm text-gray-500 truncate">{employee?.job || 'No position'}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {lastLocation.timestamp
                        ? format(new Date(lastLocation.timestamp), 'h:mm a')
                        : 'Unknown time'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {lastLocation.timestamp
                        ? format(new Date(lastLocation.timestamp), 'MMM d')
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No employee location data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLocation && (
        <Card className="shadow-md border-t-4 border-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span>Location Details</span>
              <Badge variant="outline">{format(new Date(selectedLocation.timestamp), 'PPp')}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={selectedLocation.employee?.avatar} />
                <AvatarFallback className="bg-green-100 text-green-600 text-lg">
                  {selectedLocation.employee?.name ? selectedLocation.employee.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedLocation.employee?.name || 'Unknown Employee'}</h3>
                <p className="text-gray-500">{selectedLocation.employee?.job || 'No position'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Latitude</div>
                <div className="font-mono">{selectedLocation.latitude.toFixed(6)}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Longitude</div>
                <div className="font-mono">{selectedLocation.longitude.toFixed(6)}</div>
              </div>
            </div>

            <div className="mt-4 border rounded-lg overflow-hidden h-[200px] bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-2xl">📍</div>
                <p className="mt-2">Map view would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeLocation;
