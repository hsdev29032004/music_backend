const mongoose = require("mongoose")

const PlaylistSchema = new mongoose.Schema({
    name: String,
    avatar: {
        type: String,
        default: "" // Điền url ảnh nếu không có avt, nếu có bài hát thì lấy avt bài hát đầu tiên        
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    music: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Music',
        default: []
    }],
})

const Playlist = mongoose.model("Playlist", PlaylistSchema, "playlists")

module.exports = Playlist