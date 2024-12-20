import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ setMapCenter }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to fetch location based on search connecting with API
  const fetchLocations = async (searchQuery) => {
    if (!searchQuery) return; // Prevent empty queries
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`);
      setResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Debounced fetch for locations
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchLocations(query.trim());
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 30); // 30ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (lat, lon) => {
    setMapCenter([lat, lon]);
    setQuery('');
    setResults([]);
    setShowDropdown(false); // Hide dropdown after selection
  };

  //Handle search as query for API
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  //Handle when user clear search bar and close dropdwon
  const handleInputClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a location"
        className="search-input"
      />
      {/* Render the dropdown only if query is valid */}
      {query && (
        <button onClick={handleInputClear} className="clear-button">X</button>
      )}
      {showDropdown && results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handleSelect(result.lat, result.lon)}
              className="search-item"
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
