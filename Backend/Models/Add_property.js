const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PropertySchema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true, default: uuidv4 },
    propertyName: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    preferredBy: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    oneSharing: { type: Number },
    twoSharing: { type: Number },
    threeSharing: { type: Number},
    fourSharing: { type: Number },
    propertyType: { type: String, required: true },
    branchName: { type: String, required: true },
    phaseName: { type: String, required: true },
    propertyOwnerName: { type: String, required: true },
    occupanets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    staffs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Maintanance" }],
    messOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "MessOrder" }],
    messPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "peopleModel" }],
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
