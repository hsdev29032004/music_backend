const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const MusicSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, slug: "name", unique: true},
    urlMp3: String,
    lyrics: {
        content: String,
        scroll: Boolean
    },
    background: String,
    avatar: String,
    description: String,
    singerId: String,
    otherSingersId: Array,
    quantityLike: {
        type: Number,
        default: 0
    },
    album: Array,
    musicType: Array,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Music = mongoose.model("Music", MusicSchema, "musics")

module.exports = Music