const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    requestTime: {
        type: Date,
        required: true,
    },
    expiryTime: {
        type: Date,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset
