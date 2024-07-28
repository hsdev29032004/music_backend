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
        default: "https://res.cloudinary.com/dfjft1zvv/image/upload/v1721808393/famcido781xorsyoazvs.jpg"
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