const mongoose = require("mongoose")

const AlbumSchema = new mongoose.Schema({
    name: String,
    slug: String,
    avatar: String,
    singerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Singer' 
    },
    quantityLike: {
        type: Number,
        default: 0
    },
})

const Album = mongoose.model("Album", AlbumSchema, "albums")

module.exports = Album