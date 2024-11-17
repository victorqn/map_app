require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Marker } = require('./models/markers.js');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = process.env.MONGO_URI
const connectToDB = async () => {
    try {
        await mongoose.connect(uri, {
            autoIndex: true
        })
        console.log('Connected to Mongodb Atlas');} catch (error) {
        console.error(error);
    }
}
connectToDB()

// Define the route to get all markers
app.get('/api/markers', async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching markers' });
  }
});

// Define the route to add a new marker
app.post('/api/markers', async (req, res) => {
  try {
    const { lat, lng, description, timer } = req.body;
    const newMarker = new Marker({ lat, lng, description, timer });
    await newMarker.save();
    res.status(201).json(newMarker);
  } catch (error) {
    res.status(500).json({ error: 'Error saving marker', message: error.toString() });
  }
});

app.get('/test', (req, res) => {
    res.json({
        message: 'successo'
    })    
})

const PORT = 5000 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
