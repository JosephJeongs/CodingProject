import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  userLocation: [number, number];
  mechanics: Array<{
    name: string;
    coordinates: [number, number];
  }>;
}

function Map({ userLocation, mechanics }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const initializeMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation,
      zoom: 12,
    });

    map.current = initializeMap;

    const addMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add user location marker
      const userMarker = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
        .addTo(initializeMap);
      markersRef.current.push(userMarker);

      // Add mechanics markers
      mechanics.forEach((mechanic) => {
        const marker = new mapboxgl.Marker({ color: "#0000FF" })
          .setLngLat(mechanic.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${mechanic.name}</h3>`))
          .addTo(initializeMap);
        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (mechanics.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(userLocation);
        mechanics.forEach((mechanic) => bounds.extend(mechanic.coordinates));

        initializeMap.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    };

    // Wait for map to load before adding markers
    initializeMap.on("load", addMarkers);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      initializeMap.remove();
    };
  }, [userLocation, mechanics]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}

export default Map;
