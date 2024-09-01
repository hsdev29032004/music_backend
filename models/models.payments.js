const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    orderId: String,
    user: mongoose.Schema.Types.ObjectId,
    money: Number,
    isPaid: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Payment = mongoose.model("Payment", PaymentSchema, "payments")

module.exports = Payment