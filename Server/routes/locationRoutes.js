// server/routes/locationRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                key: process.env.OPENCAGE_API_KEY,
                q: query,
                limit: 5,
            },
        });
        const suggestions = response.data.results.map((result) => ({
            label: result.formatted,
            lat: result.geometry.lat,
            lng: result.geometry.lng,
        }));
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch location data" });
    }
});

module.exports = router;
