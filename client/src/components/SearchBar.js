import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setMapCenter }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchLocation = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
      setResults(response.data);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleSelect = (lat, lon) => {
    setMapCenter([lat, lon]);
    setResults([]); // Clear dropdown
    setQuery(''); // Clear search bar
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
        className="search-input"
      />
      <button onClick={searchLocation} 
      className="search-button">Search</button>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li key={index} 
            onClick={() => handleSelect(result.lat, result.lon)} 
            className="search-item">
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
