const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,
    slug: String,
    deleted: {
        type: Boolean,
        default: false
    },
    level: {
        type: Number,
        default: 1
    },
    avatar: {
        type: String,
        default: "https://res-console.cloudinary.com/dfjft1zvv/media_explorer_thumbnails/494d90f16bdfd0ab35377c1d338a4a43/hover?v=1722247373"
    },
    likedMusic: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Music',
        default: [] 
    }],
    subcribedSinger: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Singer',
        default: []
    }],
    likedAlbum: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album',
        default: []
    }]
}, {
    timestamps: true
})

const User = mongoose.model("User", UserSchema, "users")

module.exports = User