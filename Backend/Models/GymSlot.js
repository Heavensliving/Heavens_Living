// const mongoose = require('mongoose');

// const gymSlotSchema = new mongoose.Schema({
//   date: {
//     type: String, // Format: YYYY-MM-DD
//     required: true,
//   },
//   time: {
//     type: String, // Format: "5am - 7am"
//     required: true,
//   },
//   bookings: {
//     type: Number,
//     default: 0,
//   },
//   maxBookings: {
//     type: Number,
//     default: 15,
//   }
// });

// gymSlotSchema.index({ date: 1, time: 1 }, { unique: true });

// module.exports = mongoose.model('GymSlot', gymSlotSchema);


const mongoose = require('mongoose');

const bookedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  date: {
    type: String, // duplicate from parent for direct access
    required: true
  },
  time: {
    type: String,
    required: true
  },
}, { _id: false }); // avoid nested _id fields

const gymSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  time: {
    type: String, // Format: "5am - 7am"
    required: true
  },
  bookings: {
    type: Number, 
    default: 0
  },
  maxBookings: {
    type: Number,
    default: 15
  },
  bookedUsers: [bookedUserSchema]
});

gymSlotSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('GymSlot', gymSlotSchema);
