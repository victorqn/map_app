const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  description: String,
  timer: String, // Store the timestamp when the marker was created
  
});

const Marker = mongoose.model('Marker', markerSchema);

module.exports = { Marker }

// // server.js or your routes file
// const mongoose = require('mongoose');

// const markerSchema = new mongoose.Schema({
//   lat: Number,
//   lng: Number,
//   description: String,
//   timer: Number, // Store the timestamp for when it should be removed
// });

// module.exports = mongoose.model('marker', markerSchema);

