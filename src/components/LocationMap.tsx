
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Employee } from '@/pages/Track';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xpejZ1eGV1MDJvMzNkbWtqN2c2YnB4YiJ9.e3yBEy6IjQNb0z3X2XwmtQ';

export interface LocationMapProps {
  employee: Employee;
}

const LocationMap: React.FC<LocationMapProps> = ({ employee }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !employee.location) return;

    if (!map.current) {
      // Initialize map if it doesn't exist
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [employee.location.lng, employee.location.lat],
        zoom: 14
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } else {
      // Just update the center if map already exists
      map.current.setCenter([employee.location.lng, employee.location.lat]);
    }

    // Add marker for employee location
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([employee.location.lng, employee.location.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${employee.name}</h3><p>${employee.role}</p><p>Last active: ${employee.lastActive}</p>`
        )
      )
      .addTo(map.current);

    return () => {
      // Cleanup function
    };
  }, [employee]);

  return (
    <div className="h-full min-h-[400px] w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
    </div>
  );
};

export default LocationMap;
