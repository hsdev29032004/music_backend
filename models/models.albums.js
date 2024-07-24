const mongoose = require("mongoose")

const AlbumSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    singerId: String,
    quantityLike: {
        type: Number,
        default: 0
    },
    music: {
        type: Array,
        default: []
    },
})

const Album = mongoose.model("Album", AlbumSchema, "albums")

module.exports = Album