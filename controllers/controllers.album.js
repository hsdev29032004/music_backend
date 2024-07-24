const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Album = require("../models/models.albums.js")

// GET: /api/album?query
module.exports.getListAlbum = async (req, res) => {
    try {
        let {singerId, name} = req.query
        name = new RegExp(name, "i")
        let query = {}
        if(singerId){
            query.singerId = singerId
        }
        if(name){
            query.name = name
        }
        const album = await Album.find(query)
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy danh sách album thành công",
            data: album
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Không tìm thấy danh sách nào.",
            data: null
        });
    }
}

// GET: /api/album/:id
module.exports.getOneAlbum = async (req, res) => {
    try {
        const { id } = req.params
        const album = await Album.findOne({
            _id: id
        })
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy album thành công",
            album: album
        })
    }
    catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Không có kết quả.",
            data: null
        });
    }
}