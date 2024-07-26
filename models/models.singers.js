const mongoose = require("mongoose")

const SingerSchema = new mongoose.Schema({
    fullName: String,
    slug: String,
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dfjft1zvv/image/upload/v1721645777/gnhtffxxfperpjobu9te.jpg"
    },
    description: String,
    quantitySubcriber:{
        type: Number,
        default: 0
    }
})

const Singer = mongoose.model("Singer", SingerSchema, "singers")

module.exports = Singer