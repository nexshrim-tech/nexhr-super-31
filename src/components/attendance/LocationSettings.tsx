
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, X } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface LocationSettingsProps {
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
}

const LocationSettings = ({ locations, onLocationsChange }: LocationSettingsProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [newLocationName, setNewLocationName] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler for adding locations
    map.current.on('click', (e) => {
      if (newLocationName) {
        const newLocation: Location = {
          id: Date.now().toString(),
          name: newLocationName,
          coordinates: [e.lngLat.lng, e.lngLat.lat]
        };

        // Add marker
        new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current!);

        // Add circle for 250m radius
        map.current?.addSource(`circle-${newLocation.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            },
            properties: {}
          }
        });

        map.current?.addLayer({
          id: `circle-${newLocation.id}`,
          type: 'circle',
          source: `circle-${newLocation.id}`,
          paint: {
            'circle-radius': 250,
            'circle-color': '#4353ff',
            'circle-opacity': 0.2,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#4353ff'
          }
        });

        onLocationsChange([...locations, newLocation]);
        setNewLocationName("");
      }
    });

    // Add existing locations to map
    locations.forEach(location => {
      new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .addTo(map.current!);

      map.current?.addSource(`circle-${location.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          properties: {}
        }
      });

      map.current?.addLayer({
        id: `circle-${location.id}`,
        type: 'circle',
        source: `circle-${location.id}`,
        paint: {
          'circle-radius': 250,
          'circle-color': '#4353ff',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#4353ff'
        }
      });
    });

    return () => map.current?.remove();
  }, [locations.length]);

  const handleLocationRemove = (locationId: string) => {
    // Remove the location's marker and circle from the map
    map.current?.removeLayer(`circle-${locationId}`);
    map.current?.removeSource(`circle-${locationId}`);
    
    // Update locations state
    onLocationsChange(locations.filter(l => l.id !== locationId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Office Locations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Location name"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
          />
          <Button variant="outline" disabled={!newLocationName}>
            <MapPin className="h-4 w-4 mr-2" />
            Click on map to add
          </Button>
        </div>
        
        <div ref={mapContainer} className="h-[400px] rounded-lg" />
        
        <div className="space-y-2">
          <Label>Added Locations</Label>
          <div className="space-y-2">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {loc.coordinates[1].toFixed(6)}, {loc.coordinates[0].toFixed(6)}
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleLocationRemove(loc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSettings;
