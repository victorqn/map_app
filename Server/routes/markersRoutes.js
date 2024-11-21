// server/routes/markerRoutes.js
const express = require('express');
const Marker = require('../models/marker');
const router = express.Router();

// Get all markers
router.get('/', async (req, res) => {
    const markers = await Marker.find();
    res.json(markers);
});

// Create new marker
router.post('/', async (req, res) => {
    const marker = new Marker(req.body);
    await marker.save();
    res.json(marker);
});



module.exports = router;
