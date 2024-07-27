const mongoose = require("mongoose")

const PlaylistSchema = new mongoose.Schema({
    name: String,
    slug: String,
    avatar: {
        type: String,
        default: "https://photo-zmp3.zmdcdn.me/album_default.png"
    },
    userId: String,
    music: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Music',
        default: []
    }],
})

const Playlist = mongoose.model("Playlist", PlaylistSchema, "playlists")

module.exports = Playlist