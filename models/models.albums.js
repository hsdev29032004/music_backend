const mongoose = require("mongoose")

const AlbumSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    userId: String,
    quantityLike: {
        type: Number,
        default: 0
    },
    music: Array,
})

const Album = mongoose.model("Album", AlbumSchema, "albums")

module.exports = Album