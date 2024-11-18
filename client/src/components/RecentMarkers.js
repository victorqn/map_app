import React from 'react';



const RecentMarkers = ({ markers }) => {
  const oneHourAgo = Date.now() - 3600000; // One hour in milliseconds

  const recentMarkers = markers.filter(marker => {
    const markerTime = Number(marker.timer); // Ensure proper timestamp comparison
    return markerTime > oneHourAgo;
  });

  return (
    <div className="recentMarkers"style={{ height: '100%', width:"30vh", overflowY: 'scroll', display:"absolute" }}>
      <h3>Recent Markers</h3>
      {recentMarkers.length > 0 ? (
        recentMarkers.map((marker, index) => (
          <div key={index} 
          style={{ marginBottom: '10px', 
          borderBottom: '1px solid #ccc', 
          paddingBottom: '10px' }}>
            <p><strong>Description:</strong> {marker.description}</p>
            <p><strong>Added:</strong> {Math.round((Date.now() - marker.timer) / 60000)} minutes ago</p>
          </div>
        ))
      ) : (
        <p>No recent markers.</p>
      )}
    </div>
  );
};

export default RecentMarkers;
