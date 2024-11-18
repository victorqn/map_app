import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent'; 
import RecentMarkers from './components/RecentMarkers';

function App() {
  const [markers, setMarkers] = React.useState([]);

  return (
    <div className="App">
      <div className="map-section">
        <MapComponent markers={markers} setMarkers={setMarkers} />
      </div>
      <div className="recent-markers-section">
        <RecentMarkers 
        markers={markers}
        style={{height:"100%", widht:"30vh"}} />
      </div>
    </div>
  );
}

export default App;
