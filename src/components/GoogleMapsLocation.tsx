import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapsLocationProps {
  apiKey: string;
  defaultLocation: { lat: number; lng: number };
}

const GoogleMapsLocation: React.FC<GoogleMapsLocationProps> = ({ apiKey, defaultLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

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
      if (mapRef.current && window.google) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        const initialMarker = new window.google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          title: "Current Location",
        });

        setMarker(initialMarker);

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

        // Add the button to the map
        mapInstance.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

        locationButton.addEventListener("click", () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                mapInstance.setCenter(newLocation);
                initialMarker.setPosition(newLocation);
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          } else {
            console.error("Geolocation is not supported by this browser.");
          }
        });

        window.google.maps.event.addListener(mapInstance, 'click', (event: google.maps.MouseEvent) => {
          const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };

          initialMarker.setPosition(newLocation);
          mapInstance.panTo(newLocation);
        });
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }

    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (script) {
        script.remove();
        console.log('Google Maps script removed.');
      }
    };
  }, [apiKey, defaultLocation]);

  return (
    <div style={{ width: '100%', height: '400px' }} ref={mapRef} id="map" />
  );
};

export default GoogleMapsLocation;
