const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,
    role: {
        type: String,
        default: "basic"
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dfjft1zvv/image/upload/v1721645777/gnhtffxxfperpjobu9te.jpg"
    },
    likedMusic: {
        type: Array,
        default: []
    },
    subcribedSinger: {
        type: Array,
        default: []
    },
    likedAlbum: {
        type: Array,
        default: []
    }
})

const User = mongoose.model("User", UserSchema, "users")

module.exports = User