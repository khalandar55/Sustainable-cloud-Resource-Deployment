
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Map = ({ zones }) => {
  return (
    <MapContainer center={[51.1657, 10.4515]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      {zones.map((zone, index) => (
        <Marker
          key={index}
          position={[zone.latitude, zone.longitude]}
          icon={customIcon}
        >
          <Popup>
            <strong>{zone.zone}</strong><br />
            Fossil-Free Percentage: {zone.fossilFreePercentage}%<br />
            Renewable Energy: {zone.renewablePercentage}%
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
