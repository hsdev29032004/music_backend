const mongoose = require("mongoose")

const MusicTypeSchema = new mongoose.Schema({
    name: String,
    slug: String,
    avatar: String
})

const MusicType = mongoose.model("MusicType", MusicTypeSchema, "musicTypes")

module.exports = MusicType