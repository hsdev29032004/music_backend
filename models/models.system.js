const mongoose = require("mongoose")

const SystemSchema = new mongoose.Schema({
    siteName: String,
    footer: String,
    upgradePrice: Number,
    momo: String,
    logoUrl: String,
    maintenanceMode: Boolean,
})

const System = mongoose.model("System", SystemSchema, "system")

module.exports = System