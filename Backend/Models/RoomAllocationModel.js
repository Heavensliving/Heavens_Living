
const mongoose = require('mongoose');


const RoomAllocationSchema = new mongoose.Schema({

  roomNumber: {
    type: String,
    required:true
  },
  roomType: {
    type:String,
    required:true,
  },
  Occupant: {
    type:Number,
    required:true,
  },
  vacantslot: {
      type: Number,
      required: true,
    },
    status: {
      type:String,
      enum:["available","unavailable"],
      required: true,
    }
  
});
const Rooms = mongoose.model('Rooms', RoomAllocationSchema);

module.exports = Rooms;


