import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setMapCenter }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query) {
      // const response = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=pk.b47eaa52c10e3a41293b419aa4c00417&q=${query}&format=json`);
     const response = {
      data: [
        {
            "place_id": "321015800549",
            "osm_id": "525181760",
            "osm_type": "way",
            "licence": "https://locationiq.com/attribution",
            "lat": "-37.8634021",
            "lon": "144.7518208",
            "boundingbox": [
                "-37.8637213",
                "-37.8622915",
                "144.7518166",
                "144.7518247"
            ],
            "class": "highway",
            "type": "residential",
            "display_name": "Almondberry Way, Williams Landing, Melbourne, Victoria, 3027, Australia",
            "display_place": "Almondberry Way",
            "display_address": "Williams Landing, Melbourne, Victoria, 3027, Australia",
            "address": {
                "name": "Almondberry Way",
                "suburb": "Williams Landing",
                "city": "Melbourne",
                "state": "Victoria",
                "postcode": "3027",
                "country": "Australia",
                "country_code": "au"
            }
        }
      ]
    }
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
