import React, { useState, useEffect } from 'react';
import axios from 'axios';

const server = "http://localhost:5000";

const RecentMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch markers from the server
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`${server}/api/markers`); // Update to match your server's URL
        setMarkers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching markers');
        setLoading(false);
      }
    };

    fetchMarkers();
  }, []);

  

  const maxMarkersToShow = 5; // Adjust to the desired number
  const recentMarkers = markers
    .sort((a, b) => b.timer - a.timer)
    .slice(0, maxMarkersToShow);
  

  return (
<div className="recent-markers-section">
  <h3>Recent Markers</h3>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>{error}</p>
  ) : recentMarkers.length > 0 ? (
    recentMarkers.map((marker, index) => (
      <div key={index} className="recent-markers-item">
        <p><strong>Description:</strong> {marker.description}</p>
        <p><strong>Added:</strong> {Math.round((Date.now() - marker.timer) / 600000)} minutes ago</p>
      </div>
    ))
  ) : (
    <p>No recent markers.</p>
  )}
</div>

  );
};

export default RecentMarkers;
