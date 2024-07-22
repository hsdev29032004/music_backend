const mongoose = require("mongoose")

const ForgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    expired: {
        type: Boolean,
        default: false
    },
    isUsed: {
        type: Boolean,
        default: false
    }
})

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema, "forgot-password")

module.exports = ForgotPassword