
const mongoose = require('mongoose');
const Property = require('./Add_property');


const RoomAllocationSchema = new mongoose.Schema({

  propertyName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true,
  },
  roomCapacity: {
    type: String,
    required: true,
  },
  occupant: {
    type: Number,
    default: 0,
    required: false,
  },
  vacantSlot: {
    type: Number,
    default: 0,
    required: false,
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    required: true,
  },
  occupanets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  dailyRent: [{ type: mongoose.Schema.Types.ObjectId, ref: "DailyRent" }],
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },

});
const Rooms = mongoose.model('Rooms', RoomAllocationSchema);

module.exports = Rooms;


