
import React, { useEffect, useRef, useState } from 'react';

interface EmployeeLocation {
  employeeid: number;
  firstname: string;
  lastname: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface GoogleMapsLocationProps {
  apiKey: string;
  defaultLocation?: { lat: number; lng: number };
  employeeData?: EmployeeLocation[];
  readOnly?: boolean;
  onLocationUpdate?: (latitude: number, longitude: number) => Promise<void>;
}

const GoogleMapsLocation: React.FC<GoogleMapsLocationProps> = ({ 
  apiKey, 
  defaultLocation = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  employeeData = [],
  readOnly = false,
  onLocationUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded.');
        initMap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script.');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        // Create the location button correctly
        const locationButton = document.createElement("button");
        locationButton.textContent = "📍";
        locationButton.className = "custom-map-control-button";
        locationButton.type = "button";

        // Style the button
        locationButton.style.backgroundColor = "#fff";
        locationButton.style.border = "none";
        locationButton.style.borderRadius = "2px";
        locationButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        locationButton.style.cursor = "pointer";
        locationButton.style.margin = "10px";
        locationButton.style.padding = "0 0.5em";
        locationButton.style.height = "40px";
        locationButton.style.fontSize = "1.5rem";

        // Fixed: Use a div as control container
        if (mapInstance.controls && google.maps.ControlPosition) {
          // Create a container div to hold the button
          const controlDiv = document.createElement('div');
          controlDiv.appendChild(locationButton);
          
          // Use RIGHT_BOTTOM position and push the container div
          mapInstance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
        }

        locationButton.addEventListener("click", () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                mapInstance.setCenter(newLocation);
                
                // If we're not read-only, update the user's location
                if (!readOnly && onLocationUpdate) {
                  onLocationUpdate(newLocation.lat, newLocation.lng);
                }
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          } else {
            console.error("Geolocation is not supported by this browser.");
          }
        });

        if (!readOnly && window.google.maps.event) {
          window.google.maps.event.addListener(mapInstance, 'click', (event: google.maps.MouseEvent) => {
            const newLocation = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };

            // If onLocationUpdate is provided, call it with the new location
            if (onLocationUpdate) {
              onLocationUpdate(newLocation.lat, newLocation.lng);
            }
            
            mapInstance.panTo(newLocation);
          });
        }
      }
    };

    // Clear any existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }

    return () => {
      // Clean up markers
      markers.forEach(marker => marker.setMap(null));
    };
  }, [apiKey, defaultLocation, readOnly, onLocationUpdate]);

  // Add effect to render employee markers when employee data changes
  useEffect(() => {
    if (!map || !employeeData.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create new markers for each employee
    const newMarkers = employeeData.map(employee => {
      const marker = new google.maps.Marker({
        position: { lat: employee.latitude, lng: employee.longitude },
        map: map,
        title: `${employee.firstname} ${employee.lastname}`,
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // If there are markers, fit the map to show all of them
    if (newMarkers.length > 0 && map) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      map.fitBounds(bounds);
      
      // If only one marker, zoom in a bit
      if (newMarkers.length === 1) {
        map.setZoom(14);
      }
    }
    
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, employeeData]);

  return (
    <div style={{ width: '100%', height: '400px' }} ref={mapRef} id="map" />
  );
};

export default GoogleMapsLocation;
