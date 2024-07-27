const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Album = require("../models/models.albums.js")
const Singer = require("../models/models.singers.js")
const Music = require("../models/models.musics.js")
const { deleteImage } = require ("../helper/cloudinary.js")
const slugHelper = require("../helper/slug.js");
const user = require("../helper/user.js")

// GET: /api/album?keyword=
module.exports.getListAlbum = async (req, res) => {
    try {
        keyword = slugHelper.slug(req.query.keyword || "")
        keyword = new RegExp(keyword.slice(0, -11), "i")

        const album = await Album.find({
            slug: keyword
        })
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

// GET: /api/album/:slug
module.exports.getOneAlbum = async (req, res) => {
    try {
        const album = await Album.findOne({
            slug: req.params.slug
        }).lean()

        const musics = await Music.find({
            deleted: false,
            album: album._id
        })
            .populate({
                path: 'singerId',
                select: 'fullName'
            })
            .populate({
                path: 'otherSingersId',
                select: 'fullName'
            });

        const isPremium = await user.checkPremium(req, res);

        musics.forEach(element => {
            if(!isPremium && element.premium){
                element.urlMp3 = "https://res.cloudinary.com/dfjft1zvv/video/upload/v1721927244/n9ujjl017jhim7j6gevz.m4a"
            }
        });
        
        album.infoMusic = musics

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
            music: arrMusic,
            slug: slugHelper.slug(name)
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
        let newAlbum = {
            name,
            singerId,
            music: music ? music.split(',').map(id => id.trim()) : [],
            slug: slugHelper.slug(name)
        }
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