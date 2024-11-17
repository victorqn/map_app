import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const server = "http://localhost:5000"

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);

  // Function to fetch markers from the server (if they persist between sessions)
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`${server}/api/markers`);
        setMarkers(response.data);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    fetchMarkers();
  }, []);

  // Add a marker on map click
  const addMarker = (lat, lng) => {
    const newMarker = {
      lat,
      lng,
      description: '10-minute timer marker',
      timer: Date.now() + 600000, // 10 minutes from now
    };

    axios.post(`${server}/api/markers`, newMarker)
      .then((response) => {
        setMarkers([...markers, response.data]);
      })
      .catch((error) => {
        console.error('Error saving marker:', error);
      });
  };

  // Remove expired markers by comparing current time to the timer
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.timer > currentTime)
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  // Custom Leaflet icon (optional)
  const customIcon = new L.Icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
    iconSize: [38, 95],
  });

  // Handle map events for clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        addMarker(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={customIcon}
        >
          <Popup>
            {marker.description}
            <br />
            <strong>Time left: {Math.max(0, Math.floor((marker.timer - Date.now()) / 60000))} minutes</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
