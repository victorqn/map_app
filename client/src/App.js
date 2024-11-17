import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import 'leaflet/dist/leaflet.css';

function App() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London

  return (
    <div className="App" style={{height:"100vh", width:"100%"}}>
      <SearchBar setMapCenter={setMapCenter} />
      <MapComponent mapCenter={mapCenter} />
    </div>
  );
}

export default App;
