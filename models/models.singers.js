const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const SingerSchema = new mongoose.Schema({
    fullName: String,
    slug: { type: String, slug: "fullName", unique: true},
    background: String,
    avatar: String,
    description: String,
    quantitySubcriber:{
        type: Number,
        default: 0
    }
})

const Singer = mongoose.model("Singer", SingerSchema, "singers")

module.exports = Singer