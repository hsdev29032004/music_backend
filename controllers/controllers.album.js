const CONFIG_MESSAGE_ERRORS = require("../config/error.js")
const System = require("../models/models.system.js")

module.exports.index = async (req, res) => {
    const system = await System.find({})
    res.status(200).json(system)
}