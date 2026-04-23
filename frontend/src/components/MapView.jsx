import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle auto-zooming map to polyline
const MapBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50] });
    }
  }, [map, positions]);
  return null;
};

const MapView = ({ routeGeometry }) => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (routeGeometry && routeGeometry.coordinates) {
      // OSRM returns [lon, lat], Leaflet needs [lat, lon]
      const leafletCoords = routeGeometry.coordinates.map(coord => [coord[1], coord[0]]);
      setPositions(leafletCoords);
    } else {
      setPositions([]);
    }
  }, [routeGeometry]);

  return (
    <div className="glass p-2 rounded-2xl shadow-xl w-full h-[400px] overflow-hidden relative">
      <MapContainer 
        center={[39.8283, -98.5795]} 
        zoom={4} 
        scrollWheelZoom={false}
        className="w-full h-full rounded-xl"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {positions.length > 0 && (
          <>
            <Polyline positions={positions} color="#3b82f6" weight={5} opacity={0.8} />
            <MapBounds positions={positions} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
