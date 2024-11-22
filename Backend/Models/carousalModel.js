const mongoose = require('mongoose');

// Carousal Schema
const CarousalSchema = new mongoose.Schema({
  cafeImages: {
    type: [String], // Array of strings for cafe images
    required: true,
  },
  homeScreenImages: {
    type: [String], // Array of strings for home screen images
    required: true,
  },
});

const Carousal = mongoose.model('Carousal', CarousalSchema);
module.exports = Carousal;
