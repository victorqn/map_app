import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import MarkerForm from './MarkerForm'; // Import the form
import SearchBar from './SearchBar'; // Import the Search Bar component

const server = "http://localhost:5000";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // Track selected marker
  const [mapCenter, setMapCenter] = useState([-37.8136, 144.9631]); // Default center
  const [showForm, setShowForm] = useState(false); // Track if the form should be displayed
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`${server}/api/markers`);
        setMarkers(response.data);
      } catch (error) {
        console.error('Error fetching markers:', error.toString());
      }
    };

    fetchMarkers();
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.timer > currentTime)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowForm(true); // Show the form when a marker is clicked
  };

  const handleFormSubmit = (formData) => {
    // You can update the marker with the form data (tram number, route)
    console.log('Form submitted with data:', formData);
    setShowForm(false); // Close the form after submission
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        addMarker(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <SearchBar /> {/* Keep search bar intact */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: '70%', width: '100%' }}
        ref={(ref) => { if (ref) mapRef.current = ref; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(marker), // Show form when marker is clicked
            }}
          >
            <Popup>
              {marker.description}
              <br />
              <strong>Time left: {Math.max(0, Math.floor((marker.timer - Date.now()) / 60000))} minutes</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showForm && selectedMarker && (
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
        >
          <MarkerForm
            onSubmit={handleFormSubmit}
            onClose={() => setShowForm(false)} // Close form when Cancel is clicked
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
