
import React, { useState, useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleMapsLocation from "@/components/GoogleMapsLocation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import FeatureLock from "@/components/FeatureLock";
import { MapPin, User, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface EmployeeLocation {
  employeeid: number;
  firstname: string;
  lastname: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const Track = () => {
  const [employeeLocations, setEmployeeLocations] = useState<EmployeeLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { employeeId } = useAuth();
  const { features } = useSubscription();
  
  // Feature check - only accessible with subscription
  if (!features.attendanceTracking) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserHeader title="Employee Tracking" />
          <main className="flex-1 p-6 overflow-y-auto">
            <FeatureLock 
              title="Employee Location Tracking" 
              description="Upgrade your plan to access employee location tracking features."
            />
          </main>
        </div>
      </div>
    );
  }
  
  // Fetch employee locations on component mount
  useEffect(() => {
    fetchEmployeeLocations();
  }, []);
  
  // Fetch employee locations from database
  const fetchEmployeeLocations = async () => {
    setIsLoading(true);
    
    try {
      // Join track and employee tables to get location and employee info
      const { data, error } = await supabase
        .from('track')
        .select(`
          trackid,
          latitude,
          longitude,
          timestamp,
          employeeid,
          employee:employeeid (
            firstname,
            lastname
          )
        `)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      // Process data for map component
      const processedData = (data || []).map(item => ({
        employeeid: item.employeeid,
        firstname: item.employee?.firstname || 'Unknown',
        lastname: item.employee?.lastname || 'User',
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp
      }));
      
      setEmployeeLocations(processedData);
    } catch (error) {
      console.error("Error fetching employee locations:", error);
      toast({
        title: "Error",
        description: "Failed to load employee locations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update employee location
  const updateMyLocation = async (latitude: number, longitude: number) => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Cannot update location: No employee ID found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('track')
        .insert([
          {
            employeeid: employeeId,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Location updated",
        description: "Your location has been updated successfully"
      });
      
      // Refresh location data
      fetchEmployeeLocations();
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Error",
        description: "Failed to update your location",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader title="Employee Tracking" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Employee Locations</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={fetchEmployeeLocations}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => fetchEmployeeLocations()}>
                  <MapPin className="h-4 w-4 mr-2" />
                  View All Locations
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-md h-[500px]">
                  <CardHeader>
                    <CardTitle className="text-lg">Location Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GoogleMapsLocation 
                      employeeData={employeeLocations}
                      readOnly={false}
                      onLocationUpdate={updateMyLocation}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {employeeLocations.length === 0 ? (
                      <div className="text-center py-6">
                        <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No location data available</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {employeeLocations.slice(0, 5).map((location, index) => (
                          <div 
                            key={`${location.employeeid}-${index}`}
                            className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                          >
                            <div className="flex items-center mb-1">
                              <User className="h-4 w-4 text-nexhr-primary mr-2" />
                              <span className="font-medium">
                                {location.firstname} {location.lastname}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 ml-6">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400 ml-6 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {location.timestamp ? 
                                format(new Date(location.timestamp), 'MMM d, yyyy h:mm a') : 
                                'Unknown time'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Update Your Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Click on the map to update your current location manually, or use the "Current Location" button to use your device's GPS.
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                updateMyLocation(
                                  position.coords.latitude,
                                  position.coords.longitude
                                );
                              },
                              () => {
                                toast({
                                  title: "Location access denied",
                                  description: "Please enable location access to use this feature",
                                  variant: "destructive"
                                });
                              }
                            );
                          } else {
                            toast({
                              title: "Geolocation not supported",
                              description: "Your browser doesn't support geolocation",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Update My Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Track;
