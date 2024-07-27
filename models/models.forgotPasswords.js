const mongoose = require("mongoose")

const ForgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        required: true,
        index: { expires: '30s' }
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    token: String,
    isAllow: {
        type: Boolean,
        default: false
    }
});


const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema, "forgot-password")

module.exports = ForgotPassword