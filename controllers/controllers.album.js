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

// POST: /api/album/create
module.exports.createAlbum = async (req, res) => {
    try {
        let {name, singerId, music} = req.body
        const avatar = req.file ? req.file.cloudinary_url : null; // Chỗ này thay null bằng ảnh mặc định
        const arrMusic = music ? music.split(',').map(id => id.trim()) : []
        const record = new Album({
            name,
            avatar,
            singerId,
            music: arrMusic
        })
        await record.save()
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Tạo album thành công",
            data: record
        })
    }
    catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            msg: "Lỗi hệ thống.",
            data: error
        });
    }
}