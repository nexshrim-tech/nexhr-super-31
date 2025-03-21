
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Map as MapIcon } from 'lucide-react';

interface GoogleMapsLocationProps {
  employeeData?: Array<{
    employeeid: number;
    firstname: string;
    lastname: string;
    latitude?: number;
    longitude?: number;
  }>;
  readOnly?: boolean;
  onLocationUpdate?: (lat: number, lng: number) => Promise<void>;
}

const GoogleMapsLocation: React.FC<GoogleMapsLocationProps> = ({ 
  employeeData = [], 
  readOnly = true,
  onLocationUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();
  
  // References for map objects
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Load API key from localStorage if available
  useEffect(() => {
    const savedKey = localStorage.getItem('google-maps-api-key');
    if (savedKey) {
      setGoogleMapsApiKey(savedKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);
  
  // Function to save API key and reload
  const saveApiKey = () => {
    if (!googleMapsApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Maps API key",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('google-maps-api-key', googleMapsApiKey);
    setShowApiKeyInput(false);
    loadGoogleMapsScript(googleMapsApiKey);
  };
  
  // Load Google Maps script
  const loadGoogleMapsScript = (apiKey: string) => {
    // Check if script already exists
    if (document.getElementById('google-maps-script')) return;
    
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setMapLoaded(true);
    };
    
    script.onerror = () => {
      toast({
        title: "Maps Failed to Load",
        description: "There was an error loading Google Maps. Please check your API key.",
        variant: "destructive"
      });
      setShowApiKeyInput(true);
    };
    
    document.head.appendChild(script);
  };
  
  // Initialize map after script loads
  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google && window.google.maps) {
      initializeMap();
    }
  }, [mapLoaded, employeeData]);
  
  // Load script if API key is available
  useEffect(() => {
    if (googleMapsApiKey && !showApiKeyInput) {
      loadGoogleMapsScript(googleMapsApiKey);
    }
  }, [googleMapsApiKey, showApiKeyInput]);
  
  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return;
    
    // Default location (center of India)
    const defaultLocation = { lat: 20.5937, lng: 78.9629 };
    
    // Create map instance
    const mapOptions: google.maps.MapOptions = {
      zoom: 5,
      center: defaultLocation,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };
    
    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add markers for employees
    employeeData.forEach(employee => {
      if (employee.latitude && employee.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: employee.latitude, lng: employee.longitude },
          map: mapInstanceRef.current,
          title: `${employee.firstname} ${employee.lastname}`,
          animation: google.maps.Animation.DROP,
        });
        
        // Add info window
        const infoContent = `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 8px; font-weight: 600;">${employee.firstname} ${employee.lastname}</h3>
            <p style="margin: 0;">Employee ID: ${employee.employeeid}</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
        });
        
        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
        
        markersRef.current.push(marker);
      }
    });
    
    // Add user location tracking if not in read-only mode
    if (!readOnly && onLocationUpdate && mapInstanceRef.current) {
      // Add click listener for location selection
      google.maps.event.addListener(mapInstanceRef.current, 'click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          
          // Clear current location marker and add new one
          markersRef.current.forEach(marker => marker.setMap(null));
          markersRef.current = [];
          
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            title: 'Your location',
            animation: google.maps.Animation.DROP,
          });
          
          markersRef.current.push(marker);
          
          // Update location via callback
          onLocationUpdate(lat, lng);
        }
      });
      
      // Add button to get current location
      const locationButton = document.createElement("button");
      locationButton.textContent = "Current Location";
      locationButton.classList.add(
        "bg-white", "p-2", "rounded", "shadow", "text-sm", "mt-2", "mr-2"
      );
      
      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setCenter(pos);
                mapInstanceRef.current.setZoom(15);
                
                // Clear current location marker and add new one
                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];
                
                const marker = new google.maps.Marker({
                  position: pos,
                  map: mapInstanceRef.current,
                  title: 'Your location',
                  animation: google.maps.Animation.DROP,
                });
                
                markersRef.current.push(marker);
                
                // Update location via callback
                onLocationUpdate(pos.lat, pos.lng);
              }
            },
            () => {
              toast({
                title: "Location access denied",
                description: "Please enable location access to use this feature.",
                variant: "destructive"
              });
            }
          );
        } else {
          toast({
            title: "Geolocation not supported",
            description: "Your browser doesn't support geolocation.",
            variant: "destructive"
          });
        }
      });
      
      // Add the control to the map
      if (mapInstanceRef.current.controls && google.maps.ControlPosition) {
        mapInstanceRef.current.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          locationButton
        );
      }
    }
    
    // Fit bounds if there are markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition() as google.maps.LatLng);
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom in too close if only one marker
      if (markersRef.current.length === 1 && mapInstanceRef.current.getZoom() > 15) {
        mapInstanceRef.current.setZoom(15);
      }
    }
  };
  
  if (showApiKeyInput) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapIcon className="mr-2 h-5 w-5 text-nexhr-primary" />
            Google Maps Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">API Key Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  To use the map functionality, please enter your Google Maps API key.
                  You can obtain a key from the <a href="https://console.cloud.google.com/google/maps-apis/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium">
                Google Maps API Key
              </label>
              <input
                id="api-key"
                type="text"
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                placeholder="Enter your Google Maps API key"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <Button onClick={saveApiKey} className="w-full">
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full h-full min-h-[400px]">
      {!mapLoaded && (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexhr-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-lg"
        style={{ display: mapLoaded ? 'block' : 'none' }}
      ></div>
    </div>
  );
};

export default GoogleMapsLocation;
