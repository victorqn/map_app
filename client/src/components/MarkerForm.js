import React, { useState } from 'react';

const MarkerForm = ({ onSubmit, onClose }) => {
  const [tramNumber, setTramNumber] = useState('');
  const [route, setRoute] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); //If it does not handle the event none action will be taken
    if (tramNumber && route) {
      onSubmit({ tramNumber, route });
      onClose(); // Close the form after submission
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
      <h3>Enter Tram Info</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tram Number:</label>
          <input
            type="text"
            value={tramNumber}
            onChange={(e) => setTramNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Route:</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MarkerForm;
