const mongoose = require("mongoose")

const SingerSchema = new mongoose.Schema({
    fullName: String,
    slug: String,
    avatar: String,
    description: String,
    quantitySubcriber:{
        type: Number,
        default: 0
    }
})

const Singer = mongoose.model("Singer", SingerSchema, "singers")

module.exports = Singer