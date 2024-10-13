const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PropertySchema = new mongoose.Schema({
  propertyId: { type: String, unique: true, default: uuidv4 },
  propertyName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  preferredBy: { type: String, required: true },
  googleMapUrl: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  oneSharing: { type: Number },
  twoSharing: { type: Number },
  fourSharing: { type: Number },
  sixSharing: { type: Number },
  virtualVideoUrl: { type: String, required: true },
  amenities: { type: [String], required: true },
  occupancy: { type: [String], required: true },
  propertyType: { type: String, required: true },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  propertyOwnerName: { type: String, required: true },
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
