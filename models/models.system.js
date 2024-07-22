const mongoose = require("mongoose")

const SystemSchema = new mongoose.Schema({
    footer: String,
    upgrateVip: Number,
    momo: String
    // add thêm các field khác
})

const System = mongoose.model("System", SystemSchema, "system")

module.exports = System