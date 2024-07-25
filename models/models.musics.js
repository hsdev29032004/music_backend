const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const MusicSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, slug: "name", unique: true },
    urlMp3: String,
    lyrics: String,
    background: String,
    avatar: String,
    description: String,
    singerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Singer' },
    otherSingersId: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Singer',
        default: [] 
    }],
    quantityLike: {
        type: Number,
        default: 0
    },
    album: String,
    musicType: Array,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Music = mongoose.model("Music", MusicSchema, "musics")

module.exports = Music
