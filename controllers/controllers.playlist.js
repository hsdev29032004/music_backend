const { CONFIG_MESSAGE_ERRORS } = require("../config/error.js")
const Playlist = require("../models/models.playlists.js")
const user = require("../helper/user.js")
const slugHelper = require("../helper/slug.js")

// GET: /api/playlist/:id
module.exports.getListPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.find({
            userId: req.params.id
        })
            .select("name slug avatar userId")

        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy playlist thành công",
            data: playlist
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// GET: /api/playlist/detail/:slug
module.exports.getPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            slug: req.params.slug
        })
            .populate({
                path: "music",
                select: "name slug avatar singerId premium",
                populate: [
                    {
                        path: "singerId",
                        select: "fullName slug"
                    },
                    {
                        path: "otherSingersId",
                        select: "fullName slug"
                    }
                ]
            })
        res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
            status: "success",
            msg: "Lấy playlist thành công",
            data: playlist
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// DELETE: /api/playlist/delete/:id
module.exports.deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            _id: req.params.id
        })
        const isPermit = await user.checkPermission(res.locals.user._id, playlist.userId)
        if (isPermit) {
            await Playlist.deleteOne({
                _id: req.params.id
            })

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Xóa playlist thành công.",
                data: null
            })
        }
        res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
            status: "error",
            msg: "Bạn không có quyền sử dụng tính năng này",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// POST: /api/playlist/create
module.exports.createPlaylist = async (req, res) => {
    try {
        const name = req.body.name
        if (!name) {
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa nhập",
                data: null
            })
        }

        const slug = slugHelper.slug(name)
        const playlist = new Playlist({
            name,
            slug,
            userId: res.locals.user._id,
        })
        await playlist.save()
        res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
            status: "success",
            msg: "Tạo mới playlist thành công.",
            data: playlist
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}

// PATCH: /api/playlist/edit/:id
module.exports.editPlaylist = async (req, res) => {
    try {
        if(!req.body.name){
            return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
                status: "error",
                msg: "Tồn tại trường bắt buộc chưa nhập.",
                data: null
            })
        }
        const slug = slugHelper.slug(req.body.name)
        const playlist = await Playlist.findOne({
            _id: req.params.id
        })
        const isPermit = await user.checkPermission(res.locals.user._id, playlist.userId)
        if (isPermit) {
            await Playlist.updateOne(
                { _id: req.params.id },
                { name: req.body.name, slug: slug }
            )

            return res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
                status: "success",
                msg: "Cập nhật playlist thành công.",
                data: null
            })
        }
        res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
            status: "error",
            msg: "Bạn không có quyền sử dụng tính năng này",
            data: null
        })
    } catch (error) {
        res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
            status: "error",
            message: 'Lỗi hệ thống.',
            data: error.message
        });
    }
}