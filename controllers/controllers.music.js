const CONFIG_MESSAGE_ERRORS = require("../config/error.js")
const Music = require("../models/models.musics.js")

// GET: /api/music?query=
module.exports.getListMusic = async (req, res) => {
    // const {name, singerId, }
    const music = await Music.find({
        deleted: false
    })
    res.status(200).json(music)
}