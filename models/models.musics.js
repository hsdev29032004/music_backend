const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
    name: String,
    slug: String,
    urlMp3: String,
    lyrics: String,
    background: {
        type: String,
        default: "https://wallpapercave.com/wp/wp5595374.jpg"
    },
    avatar: String,
    description: String,
    singerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Singer' 
    },
    otherSingersId: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Singer',
        default: [] 
    }],
    quantityLike: {
        type: Number,
        default: 0
    },
    album: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Album' 
    },
    musicType: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MusicType',
        default: [] 
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    premium: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Music = mongoose.model("Music", MusicSchema, "musics")

module.exports = Music
