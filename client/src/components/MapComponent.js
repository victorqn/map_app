//Import library and components
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import SearchBar from './SearchBar';
import MarkerForm from './MarkerForm'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define server url
const server = "http://localhost:5000";

//Defines custom icon using leaflet
const customIcon = L.icon({
  iconUrl: './police-station.png', 
  iconSize: [30, 40]
});

const MapComponent = () => {
  const [markers, setMarkers] = useState([]); //Store markers
  const [mapCenter, setMapCenter] = useState([-37.8136, 144.9631]); // Initial state as center
  const [selectedLocation, setSelectedLocation] = useState(null); //Track the last clicked location to popup form
  const [showForm, setShowForm] = useState(false); // Defines if the form should open or not
  const mapRef = useRef(null);

    // Search user's location on load using Geolocation API
    useEffect(() => {
      const fetchUserLocation = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setMapCenter([latitude, longitude]);
            },
            async () => {
              // Try to search approximate location via IP using IP API
              try {
                const response = await axios.get("http://ip-api.com/json/");
                const { lat, lon } = response.data;
                //Change the state of the mapCenter
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
  
    // Update the map center when the value change(Geolocation, IP or search)
    useEffect(() => {
      if (mapRef.current) {
        const mapInstance = mapRef.current;
        mapInstance.setView(mapCenter, mapInstance.getZoom());
      }
    }, [mapCenter]);

    // Button to return to user location using Geolocation API
      const handleReturnToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  };
  
    //Fetch markers status on DB and update the value of markers
    useEffect(() => {
      const fetchMarkers = async () => {
        try {
          const response = await axios.get(`${server}/api/markers`);
          setMarkers(response.data); // Update all data in the DB
        } catch (error) {
          console.error('Error fetching markers:', error);
        }
      };
      fetchMarkers();
    }, [setMarkers]);
    
    

// Add marker a new marker
const addMarker = async (data) => {
  const { lat, lng, tramNumber, route } = data;
  const newMarker = {
    lat,
    lng,
    description: `Tram ${tramNumber}, Route: ${route}`,
    timer: Date.now() + 2 * 60 * 1000, // 2 minutes from now
  };

  try {
    const response = await axios.post(`${server}/api/markers`, newMarker);
    setMarkers((prevMarkers) => [...prevMarkers, response.data]); // Update state immediately
    await fetchMarkers(); // Re-fetch markers from DB to make sure it is precise
  } catch (error) {
    console.error('Error saving marker:', error);
  }
};

// Fetch markers from the server
const fetchMarkers = async () => {
  try {
    const response = await axios.get(`${server}/api/markers`);
    setMarkers(response.data);
  } catch (error) {
    console.error('Error fetching markers:', error);
  }
};
useEffect(() => {
  fetchMarkers();// Use useEffect to refresh markers on initial load or after updates
}, []);

    
  
    // Remove expired markers
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.timer > currentTime)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [setMarkers]);

  

// Handle map click to show the form
const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation(e.latlng); // Save the clicked location
        setShowForm(true); // Show the form changing the state to true when selectedlocation
      },
    });
    return null;
  };

  const handleFormSubmit = (formData) => {
    if (selectedLocation) {
      addMarker({ ...formData, ...selectedLocation }); // Add form data to poup
    }
    setSelectedLocation(null); // Reset the location
    setShowForm(false); // Hide the form
  };

  return (
    <div style={{ height: '100vh', width:"100%" }}>
      <SearchBar setMapCenter={setMapCenter} />
      <MapContainer 
      center={mapCenter} 
      zoom={13} style={{ height: '100%', width: '100%' }} 
      ref={mapRef}
      className='map-container'>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler />
        {markers.map((marker, index) => (
          <Marker key={index} 
          position={[marker.lat, marker.lng]} 
          icon={customIcon} >
            <Popup>
              {marker.description}
              <br />
              <strong>A myki inspector was here: {Math.max(0, Math.floor((marker.timer - Date.now()) / 60000))} minutes ago</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={handleReturnToLocation}
       className='return-location-button'
      >
        Return to My Location
      </button>

      {/* Render the MarkerForm only if marker is added */}
      {showForm && (
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <MarkerForm
            onSubmit={handleFormSubmit}
            onClose={() => setShowForm(false)} // Close the form on cancel
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
