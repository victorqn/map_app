import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import SearchBar from './SearchBar';
import MarkerForm from './MarkerForm'; // Import the new form component
import L from 'leaflet';


const server = "http://localhost:5000";

L.Icon.Default.mergeOptions({
  iconUrl: 'path_to_marker_icon',
  shadowUrl: 'path_to_marker_shadow',
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState([-37.8136, 144.9631]); // Default center
  const [selectedMarker, setSelectedMarker] = useState(null); // Track selected marker
  const [showForm, setShowForm] = useState(false); // Track if the form should be displayed
  const mapRef = useRef(null);

    // Fetch user's location on load
    useEffect(() => {
      const fetchUserLocation = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setMapCenter([latitude, longitude]);
            },
            async () => {
              try {
                const response = await axios.get("http://ip-api.com/json/");
                const { lat, lon } = response.data;
                setMapCenter([lat, lon]);
              } catch (error) {
                console.error("Error fetching IP location:", error);
              }
            }
          );
        } else {
          try {
            const response = await axios.get("http://ip-api.com/json/");
            const { lat, lon } = response.data;
            setMapCenter([lat, lon]);
          } catch (error) {
            console.error("Error fetching IP location:", error);
          }
        }
      };
      fetchUserLocation();
    }, []);
  
    // Update the map center programmatically
    useEffect(() => {
      if (mapRef.current) {
        const mapInstance = mapRef.current;
        mapInstance.setView(mapCenter, mapInstance.getZoom());
      }
    }, [mapCenter]);
  

    useEffect(() => {
      const fetchMarkers = async () => {
        try {
          const response = await axios.get(`${server}/api/markers`);
          setMarkers(response.data); // Update parent state with fetched markers
        } catch (error) {
          console.error('Error fetching markers:', error);
        }
      };
      fetchMarkers();
    }, [setMarkers]); // Dependency ensures parent state is updated
    

  const addMarker = (lat, lng) => {
    const newMarker = {
      lat,
      lng,
      description: '10-minute timer marker',
      timer: Date.now() + 100000, // 10 minutes from now
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
    }, 50);

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
    <div style={{ position: 'absolute', height: '100%' }}>
      <SearchBar setMapCenter={setMapCenter} />
      <MapContainer center={mapCenter} zoom={20} style={{ height: '70%', width: '100%' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <Marker key={index} 
          position={[marker.lat, marker.lng]} 
          eventHandlers={{ click: () => handleMarkerClick(marker) }}>
            <Popup>
              {marker.description}
              <br />
              <strong>Time left: {Math.max(0, Math.floor((marker.timer - Date.now()) / 60000))} minutes</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Conditionally render the MarkerForm if a marker is selected */}
      {showForm && selectedMarker && (
        <div
          style={{
            position: 'relative',
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
