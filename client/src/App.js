// import React from 'react';
// import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
// import Login from './components/LoginPage';
// import Register from './components/RegisterPage';
// import MapComponent from './components/MapComponent';

// function App() {
//   return (
//     <Router>
//       <div>
//         <h1>Birds Map</h1>
//         <nav>
//           <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
//         </nav>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
          
//         </Routes>
//       </div>
//     </Router>
//   );
// }


// export default App;

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