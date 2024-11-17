import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setMapCenter }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query) {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=YOUR_API_KEY&q=${query}&format=json`);
      setResults(response.data);
    }
  };

  const handleSelect = (lat, lon) => {
    setMapCenter([lat, lon]);
    setResults([]);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search for a location"
      />
      <ul>
        {results.map((result, index) => (
          <li key={index} onClick={() => handleSelect(result.lat, result.lon)}>
            {result.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
