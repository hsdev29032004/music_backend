const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Album = require("../models/models.albums.js")
const { deleteImage } = require ("../helper/cloudinary.js")

// GET: /api/album?query
module.exports.getListAlbum = async (req, res) => {
    try {
        let { singerId, name } = req.query
        name = new RegExp(name, "i")
        let query = {}
        if (singerId) {
            query.singerId = singerId
        }
        if (name) {
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
        let { name, singerId, avatar, music } = req.body
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

// DELETE: /api/album/delete/:id
module.exports.deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Album.findOne({ _id: id }).select("avatar");
    if (!record) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "error",
        msg: "Không tồn tại album",
        data: null
      });
    }

    await Album.deleteOne({ _id: id });

    await deleteImage(record.avatar);

    res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
      status: "success",
      msg: "Xóa album thành công",
      data: null
    });
  } catch (error) {
    res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
      status: "error",
      msg: "Không thể thực hiện yêu cầu.",
      data: `Không tồn tại album có id ${error.value}`
    });
  }
};

// PATCH: /api/album/edit/:id
module.exports.editAlbum = async (req, res) => {
    try {
        let { name, singerId, avatar, music } = req.body
        let newAlbum = {}
        newAlbum.name = name
        newAlbum.singerId = singerId
        newAlbum.music = music ? music.split(',').map(id => id.trim()) : []
        if(avatar){
            newAlbum.avatar=avatar
        }
        const record = await Album.findOne({ _id: req.params.id })
        if (!record) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
              status: "error",
              msg: "Không tồn tại album",
              data: null
            });
        }
        await Album.updateOne(
            {_id: req.params.id}, 
            newAlbum
        )
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Cập nhật album thành công",
            data: null
        })
    } catch (error) {
      res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
        status: "error",
        msg: "Không thể thực hiện yêu cầu.",
        data: `Không tồn tại album có id ${error.value}`
      });
    }
};