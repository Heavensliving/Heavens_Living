const mongoose = require("mongoose");

const CafeOrderByOccupantSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true, unique: true },
        customerName: { type: String, required: true },
        contact: { type: String, required: true },
        propertyName: { type: String, required: true},
        roomNumber: { type: String, required: true},
        items: [
            {
                itemName: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                rate: { type: Number, required: true },
                total: { type: Number, required: true },
                _id: false,
            }
        ],
        total: { type: Number, required: true },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["cash", "account", "credit"],
        },
        status: {
            type: String,
            enum: ["pending", "cancelled", "onGoing", "delivered"],
            default: "pending",
        },
        date: { type: Date, default: Date.now, required: true },
        occupant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: false
        },
    },
    { timestamps: true }
);

const OrderByOccupant = mongoose.model("OrderByOccupant", CafeOrderByOccupantSchema);

module.exports = OrderByOccupant;
