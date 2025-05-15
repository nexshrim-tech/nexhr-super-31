
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from './ui/skeleton';

// Define the employee location interface
interface EmployeeLocation {
  employeeid: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  trackid?: string;
  employee?: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
  };
}

interface LocationMapComponentProps {
  employeeLocations: EmployeeLocation[];
  isLoading: boolean;
}

const LocationMapComponent = ({ employeeLocations, isLoading }: LocationMapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{[key: string]: mapboxgl.Marker}>({});
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    // Mapbox public token - use your own token in production
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNsdGt0ZjYwYTB5NjIya3BidDQxaDBvbGEifQ.V7xSbDqSwHOJVLuNzfmELg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 3,
      center: [0, 20], // Default center
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      setMapInitialized(true);
    });
    
    return () => {
      // Clean up
      Object.values(markers.current).forEach(marker => marker.remove());
      if (map.current) map.current.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInitialized || !map.current || !employeeLocations.length) return;
    
    // Calculate bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    
    // Update existing markers and add new ones
    employeeLocations.forEach(location => {
      if (!location.latitude || !location.longitude) return;
      
      const lngLat = [location.longitude, location.latitude];
      bounds.extend(lngLat as mapboxgl.LngLatLike);
      
      // Create or update marker
      if (markers.current[location.employeeid]) {
        // Update existing marker position
        markers.current[location.employeeid].setLngLat(lngLat as mapboxgl.LngLatLike);
      } else {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'employee-marker';
        markerEl.style.width = '20px';
        markerEl.style.height = '20px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = getRandomColor(location.employeeid);
        markerEl.style.border = '2px solid white';
        markerEl.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin:0 0 5px; font-weight:600;">${location.employee?.firstname || ''} ${location.employee?.lastname || ''}</h3>
              <p style="margin:0; font-size:12px; color:#666;">${location.employee?.jobtitle || 'Employee'}</p>
              <p style="margin:5px 0 0; font-size:12px; color:#888;">Last updated: ${formatTime(location.timestamp)}</p>
            </div>
          `);
          
        // Create and add marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(lngLat as mapboxgl.LngLatLike)
          .setPopup(popup)
          .addTo(map.current!);
          
        markers.current[location.employeeid] = marker;
      }
    });
    
    // Remove markers for employees no longer in the list
    Object.keys(markers.current).forEach(id => {
      const employeeId = id;
      if (!employeeLocations.find(loc => loc.employeeid === employeeId)) {
        markers.current[employeeId].remove();
        delete markers.current[employeeId];
      }
    });
    
    // Fit map to show all markers if we have any
    if (Object.keys(markers.current).length > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [employeeLocations, mapInitialized]);

  // Helper function to format timestamp
  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Helper function to generate consistent colors based on employee ID
  const getRandomColor = (id: string) => {
    // Create a numeric hash from the string id
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const colors = [
      '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
      '#1DA1F2', '#8A2BE2', '#FF6347', '#20B2AA', // Twitter blue, etc
      '#FF4500', '#32CD32', '#9370DB', '#FF8C00', // Reddit orange, etc
    ];
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {employeeLocations.length === 0 && mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-4">
            <p className="text-gray-500">No location data available</p>
            <p className="text-sm text-gray-400 mt-1">Employee locations will appear here when available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMapComponent;
